import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './BibleMapSuite.css';
import {
    flyToLocation,
    calculateDistance,
    calculateBiblicalDays,
    createCustomMarker,
    exportMapAsImage,
    generateMapPDF,
    downloadBlob,
    addJourneyLayer,
    removeJourneyLayer,
    formatCoordinates
} from '../utils/mapUtils';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function BibleMapSuite({ language, userEmail, onSnapToNote }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [locations, setLocations] = useState([]);
    const [journeys, setJourneys] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [activeJourney, setActiveJourney] = useState(null);
    const [distanceMode, setDistanceMode] = useState(false);
    const [distancePoints, setDistancePoints] = useState([]);
    const [showHistoricalOverlay, setShowHistoricalOverlay] = useState(false);
    const [overlayOpacity, setOverlayOpacity] = useState(0.5);
    const markers = useRef([]);

    const t = {
        en: {
            title: 'Biblical Maps',
            search: 'Search locations...',
            journeys: 'Journeys',
            selectJourney: 'Select a journey',
            clearJourney: 'Clear Journey',
            distanceTool: 'Distance Tool',
            clickTwoPoints: 'Click two points on the map',
            distance: 'Distance',
            walkingDays: 'Biblical Walking Days',
            days: 'days',
            historicalOverlay: 'Historical Overlay',
            opacity: 'Opacity',
            export: 'Export',
            exportPNG: 'Export as PNG',
            exportJPEG: 'Export as JPEG',
            exportPDF: 'Export as PDF',
            snapToNote: 'Snap to Note',
            viewVerses: 'View Related Verses',
            addToNotes: 'Add to Sermon Notes',
            noResults: 'No locations found',
            exporting: 'Exporting...'
        },
        ua: {
            title: 'Біблійні карти',
            search: 'Пошук локацій...',
            journeys: 'Подорожі',
            selectJourney: 'Виберіть подорож',
            clearJourney: 'Очистити подорож',
            distanceTool: 'Інструмент відстані',
            clickTwoPoints: 'Клацніть дві точки на карті',
            distance: 'Відстань',
            walkingDays: 'Біблійні дні ходьби',
            days: 'днів',
            historicalOverlay: 'Історичний шар',
            opacity: 'Прозорість',
            export: 'Експорт',
            exportPNG: 'Експорт як PNG',
            exportJPEG: 'Експорт як JPEG',
            exportPDF: 'Експорт як PDF',
            snapToNote: 'Зберегти в нотатки',
            viewVerses: 'Переглянути пов\'язані вірші',
            addToNotes: 'Додати до проповіді',
            noResults: 'Локацій не знайдено',
            exporting: 'Експорт...'
        }
    };

    const text = t[language] || t.en;

    // Initialize map
    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11', // Using Mapbox dark style as base
            center: [35.2137, 31.7683], // Jerusalem
            zoom: 7,
            pitch: 0,
            bearing: 0
        });

        map.current.on('load', () => {
            // Customize the style to match our Dark-Mode-Precision theme
            map.current.setPaintProperty('water', 'fill-color', '#0033FF');
            map.current.setPaintProperty('water', 'fill-opacity', 0.6);

            setMapLoaded(true);
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // Fetch locations and journeys
    useEffect(() => {
        fetch('http://localhost:5000/api/maps/locations')
            .then(res => res.json())
            .then(data => setLocations(data))
            .catch(err => console.error('Failed to fetch locations:', err));

        fetch('http://localhost:5000/api/maps/journeys')
            .then(res => res.json())
            .then(data => setJourneys(data))
            .catch(err => console.error('Failed to fetch journeys:', err));
    }, []);

    // Add markers when locations are loaded
    useEffect(() => {
        if (!mapLoaded || !map.current || locations.length === 0) return;

        // Clear existing markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];

        // Add new markers
        locations.forEach(location => {
            const el = createCustomMarker('#0033FF');

            const marker = new mapboxgl.Marker(el)
                .setLngLat([location.longitude, location.latitude])
                .addTo(map.current);

            // Create popup
            const popupContent = `
        <div class="map-popup">
          <h3>${language === 'ua' && location.nameUkrainian ? location.nameUkrainian : location.name}</h3>
          <p>${language === 'ua' && location.descriptionUa ? location.descriptionUa : location.description || ''}</p>
          <p class="coordinates">${formatCoordinates([location.longitude, location.latitude])}</p>
          <div class="popup-actions">
            <button class="popup-btn" data-action="add-to-notes" data-location-id="${location.id}">
              ${text.addToNotes}
            </button>
          </div>
        </div>
      `;

            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(popupContent);

            marker.setPopup(popup);

            // Add click handler for popup buttons
            popup.on('open', () => {
                const addBtn = document.querySelector(`[data-action="add-to-notes"][data-location-id="${location.id}"]`);
                if (addBtn) {
                    addBtn.onclick = () => handleAddLocationToNotes(location);
                }
            });

            markers.current.push(marker);
        });
    }, [mapLoaded, locations, language]);

    // Handle search
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        const results = locations.filter(loc => {
            const nameMatch = loc.name.toLowerCase().includes(query.toLowerCase());
            const uaNameMatch = loc.nameUkrainian?.toLowerCase().includes(query.toLowerCase());
            return nameMatch || uaNameMatch;
        });

        setSearchResults(results);
    };

    const handleSelectLocation = (location) => {
        setSelectedLocation(location);
        setSearchResults([]);
        setSearchQuery('');
        flyToLocation(map.current, [location.longitude, location.latitude], { zoom: 12 });
    };

    // Handle journey selection
    const handleJourneySelect = (journey) => {
        if (activeJourney) {
            removeJourneyLayer(map.current, activeJourney.id);
        }

        if (journey && journey.id !== activeJourney?.id) {
            const waypoints = JSON.parse(journey.waypoints);
            addJourneyLayer(map.current, journey.id, waypoints, journey.color);
            setActiveJourney(journey);

            // Fit map to journey bounds
            const coordinates = waypoints.map(wp => [wp.lng, wp.lat]);
            const bounds = coordinates.reduce((bounds, coord) => {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

            map.current.fitBounds(bounds, { padding: 50 });
        } else {
            setActiveJourney(null);
        }
    };

    // Distance tool
    useEffect(() => {
        if (!map.current || !distanceMode) return;

        const handleMapClick = (e) => {
            const newPoint = [e.lngLat.lng, e.lngLat.lat];

            if (distancePoints.length === 0) {
                setDistancePoints([newPoint]);
            } else if (distancePoints.length === 1) {
                setDistancePoints([...distancePoints, newPoint]);
            } else {
                setDistancePoints([newPoint]);
            }
        };

        map.current.on('click', handleMapClick);

        return () => {
            map.current.off('click', handleMapClick);
        };
    }, [distanceMode, distancePoints]);

    // Calculate distance when two points are selected
    const distance = distancePoints.length === 2
        ? calculateDistance(distancePoints[0], distancePoints[1])
        : null;
    const walkingDays = distance ? calculateBiblicalDays(distance) : null;

    // Export functions
    const handleExportPNG = async () => {
        const dataUrl = await exportMapAsImage(map.current, 2, 'png');
        const link = document.createElement('a');
        link.download = `bible-map-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    };

    const handleExportJPEG = async () => {
        const dataUrl = await exportMapAsImage(map.current, 2, 'jpeg');
        const link = document.createElement('a');
        link.download = `bible-map-${Date.now()}.jpg`;
        link.href = dataUrl;
        link.click();
    };

    const handleExportPDF = async () => {
        const mapImage = await exportMapAsImage(map.current, 2, 'png');
        const center = map.current.getCenter();
        const locationData = {
            name: selectedLocation?.name || 'Biblical Map View',
            coordinates: [center.lng, center.lat],
            description: selectedLocation?.description || ''
        };

        const pdfBlob = await generateMapPDF(mapImage, locationData);
        downloadBlob(pdfBlob, `bible-map-${Date.now()}.pdf`);
    };

    const handleSnapToNote = async () => {
        if (!onSnapToNote) return;

        const mapImage = await exportMapAsImage(map.current, 2, 'png');
        const center = map.current.getCenter();
        const metadata = {
            center: { lat: center.lat, lng: center.lng },
            zoom: map.current.getZoom(),
            location: selectedLocation?.name || 'Map View'
        };

        onSnapToNote(mapImage, metadata);
    };

    const handleAddLocationToNotes = (location) => {
        const locationText = `\n\n📍 ${location.name}\n${location.description || ''}\nCoordinates: ${formatCoordinates([location.longitude, location.latitude])}\n`;
        // This would integrate with the StudyPanel - for now just log
        console.log('Add to notes:', locationText);
    };

    return (
        <div className="bible-map-suite">
            <div className="map-controls">
                <div className="control-section">
                    <h2>{text.title}</h2>

                    {/* Search */}
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder={text.search}
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {searchResults.length > 0 && (
                            <div className="search-results">
                                {searchResults.map(loc => (
                                    <div
                                        key={loc.id}
                                        className="search-result-item"
                                        onClick={() => handleSelectLocation(loc)}
                                    >
                                        <strong>{language === 'ua' && loc.nameUkrainian ? loc.nameUkrainian : loc.name}</strong>
                                        <span className="location-type">{loc.type}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Journeys */}
                    <div className="journey-selector">
                        <label>{text.journeys}</label>
                        <select onChange={(e) => {
                            const journey = journeys.find(j => j.id === parseInt(e.target.value));
                            handleJourneySelect(journey);
                        }} value={activeJourney?.id || ''}>
                            <option value="">{text.selectJourney}</option>
                            {journeys.map(journey => (
                                <option key={journey.id} value={journey.id}>
                                    {language === 'ua' && journey.nameUkrainian ? journey.nameUkrainian : journey.name}
                                </option>
                            ))}
                        </select>
                        {activeJourney && (
                            <button onClick={() => handleJourneySelect(null)} className="clear-btn">
                                {text.clearJourney}
                            </button>
                        )}
                    </div>

                    {/* Distance Tool */}
                    <div className="distance-tool">
                        <button
                            onClick={() => {
                                setDistanceMode(!distanceMode);
                                setDistancePoints([]);
                            }}
                            className={distanceMode ? 'active' : ''}
                        >
                            {text.distanceTool}
                        </button>
                        {distanceMode && (
                            <p className="tool-hint">{text.clickTwoPoints}</p>
                        )}
                        {distance && (
                            <div className="distance-result">
                                <p><strong>{text.distance}:</strong> {distance} km</p>
                                <p><strong>{text.walkingDays}:</strong> {walkingDays} {text.days}</p>
                            </div>
                        )}
                    </div>

                    {/* Export Controls */}
                    <div className="export-controls">
                        <label>{text.export}</label>
                        <button onClick={handleExportPNG}>{text.exportPNG}</button>
                        <button onClick={handleExportJPEG}>{text.exportJPEG}</button>
                        <button onClick={handleExportPDF}>{text.exportPDF}</button>
                        {onSnapToNote && (
                            <button onClick={handleSnapToNote} className="snap-btn">
                                {text.snapToNote}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div ref={mapContainer} className="map-container" />
        </div>
    );
}

export default BibleMapSuite;
