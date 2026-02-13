/**
 * Map Utility Functions for BibleMapSuite
 * Provides helper functions for map operations, animations, and exports
 */

/**
 * Smoothly fly to a location with pulse animation
 * @param {mapboxgl.Map} map - Mapbox map instance
 * @param {Array} coordinates - [longitude, latitude]
 * @param {Object} options - Additional options (zoom, bearing, pitch)
 */
export function flyToLocation(map, coordinates, options = {}) {
    const defaults = {
        center: coordinates,
        zoom: options.zoom || 12,
        bearing: options.bearing || 0,
        pitch: options.pitch || 0,
        duration: 2000,
        essential: true,
        easing: (t) => t * (2 - t) // easeOutQuad
    };

    map.flyTo({ ...defaults, ...options });

    // Add pulse animation after arrival
    setTimeout(() => {
        addPulseMarker(map, coordinates);
    }, 2000);
}

/**
 * Add a pulsing marker at coordinates
 * @param {mapboxgl.Map} map - Mapbox map instance
 * @param {Array} coordinates - [longitude, latitude]
 */
function addPulseMarker(map, coordinates) {
    const pulseId = `pulse-${Date.now()}`;

    // Add pulse layer
    if (!map.getSource(pulseId)) {
        map.addSource(pulseId, {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: coordinates
                }
            }
        });

        map.addLayer({
            id: pulseId,
            type: 'circle',
            source: pulseId,
            paint: {
                'circle-radius': 20,
                'circle-color': '#0033FF',
                'circle-opacity': 0.8,
                'circle-radius-transition': { duration: 2000 },
                'circle-opacity-transition': { duration: 2000 }
            }
        });

        // Animate pulse
        let radius = 20;
        let opacity = 0.8;
        const pulseInterval = setInterval(() => {
            radius += 10;
            opacity -= 0.1;

            if (opacity <= 0) {
                clearInterval(pulseInterval);
                if (map.getLayer(pulseId)) map.removeLayer(pulseId);
                if (map.getSource(pulseId)) map.removeSource(pulseId);
                return;
            }

            map.setPaintProperty(pulseId, 'circle-radius', radius);
            map.setPaintProperty(pulseId, 'circle-opacity', opacity);
        }, 200);
    }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Array} coord1 - [longitude, latitude]
 * @param {Array} coord2 - [longitude, latitude]
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2[1] - coord1[1]);
    const dLon = toRad(coord2[0] - coord1[0]);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coord1[1])) *
        Math.cos(toRad(coord2[1])) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal
}

function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Calculate biblical walking days (assuming 30km per day)
 * @param {number} distanceKm - Distance in kilometers
 * @returns {number} Number of walking days
 */
export function calculateBiblicalDays(distanceKm) {
    const kmPerDay = 30; // Average walking distance in biblical times
    return Math.ceil(distanceKm / kmPerDay);
}

/**
 * Create a custom Electric Blue SVG marker
 * @param {string} color - Marker color (default: #0033FF)
 * @returns {HTMLElement} Marker element
 */
export function createCustomMarker(color = '#0033FF') {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.width = '30px';
    el.style.height = '40px';
    el.style.cursor = 'pointer';

    el.innerHTML = `
    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25c0-8.284-6.716-15-15-15z" 
            fill="${color}" 
            stroke="#FFFFFF" 
            stroke-width="2"/>
      <circle cx="15" cy="15" r="5" fill="#FFFFFF"/>
    </svg>
  `;

    return el;
}

/**
 * Export map as high-resolution image
 * @param {mapboxgl.Map} map - Mapbox map instance
 * @param {number} scale - Scale factor (1 = normal, 2 = 2x resolution)
 * @param {string} format - 'png' or 'jpeg'
 * @returns {Promise<string>} Data URL of the image
 */
export async function exportMapAsImage(map, scale = 2, format = 'png') {
    return new Promise((resolve) => {
        map.once('render', () => {
            const canvas = map.getCanvas();
            const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);
            resolve(dataUrl);
        });

        // Trigger render
        map.setBearing(map.getBearing());
    });
}

/**
 * Generate PDF with map image and metadata
 * @param {string} mapImageDataUrl - Data URL of map image
 * @param {Object} location - Location object with name, coordinates, etc.
 * @param {Array} verses - Array of verse references
 * @returns {Blob} PDF blob
 */
export async function generateMapPDF(mapImageDataUrl, location, verses = []) {
    // Dynamic import to reduce bundle size
    const { jsPDF } = await import('jspdf');

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 255); // Electric Blue
    doc.text('Biblical Location Map', 105, 20, { align: 'center' });

    // Add map image
    doc.addImage(mapImageDataUrl, 'PNG', 10, 30, 190, 120);

    // Add location details
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Location: ${location.name}`, 10, 160);

    if (location.coordinates) {
        doc.setFontSize(10);
        doc.text(
            `Coordinates: ${location.coordinates[1].toFixed(4)}°N, ${location.coordinates[0].toFixed(4)}°E`,
            10,
            167
        );
    }

    if (location.description) {
        doc.setFontSize(10);
        const splitDescription = doc.splitTextToSize(location.description, 190);
        doc.text(splitDescription, 10, 175);
    }

    // Add verse references if provided
    if (verses && verses.length > 0) {
        doc.setFontSize(12);
        doc.text('Related Scripture References:', 10, 200);
        doc.setFontSize(10);

        let yPos = 207;
        verses.forEach((verse, index) => {
            if (yPos > 280) return; // Prevent overflow
            doc.text(`• ${verse}`, 15, yPos);
            yPos += 7;
        });
    }

    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Generated by Foundational Bible Study', 105, 290, { align: 'center' });

    return doc.output('blob');
}

/**
 * Download file from blob
 * @param {Blob} blob - File blob
 * @param {string} filename - Desired filename
 */
export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Create a journey line layer
 * @param {mapboxgl.Map} map - Mapbox map instance
 * @param {string} journeyId - Unique journey identifier
 * @param {Array} waypoints - Array of {lat, lng, name} objects
 * @param {string} color - Line color
 */
export function addJourneyLayer(map, journeyId, waypoints, color = '#0033FF') {
    const coordinates = waypoints.map(wp => [wp.lng, wp.lat]);

    const sourceId = `journey-${journeyId}`;
    const layerId = `journey-line-${journeyId}`;
    const markersLayerId = `journey-markers-${journeyId}`;

    // Add source
    if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            }
        });

        // Add line layer
        map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': color,
                'line-width': 3,
                'line-opacity': 0.8
            }
        });

        // Add waypoint markers
        map.addSource(`${sourceId}-points`, {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: waypoints.map(wp => ({
                    type: 'Feature',
                    properties: { name: wp.name },
                    geometry: {
                        type: 'Point',
                        coordinates: [wp.lng, wp.lat]
                    }
                }))
            }
        });

        map.addLayer({
            id: markersLayerId,
            type: 'circle',
            source: `${sourceId}-points`,
            paint: {
                'circle-radius': 6,
                'circle-color': color,
                'circle-stroke-color': '#FFFFFF',
                'circle-stroke-width': 2
            }
        });

        // Animate the line
        animateJourneyLine(map, layerId);
    }
}

/**
 * Animate journey line drawing
 * @param {mapboxgl.Map} map - Mapbox map instance
 * @param {string} layerId - Layer ID to animate
 */
function animateJourneyLine(map, layerId) {
    let dashArraySequence = [
        [0, 4, 3],
        [0.5, 4, 2.5],
        [1, 4, 2],
        [1.5, 4, 1.5],
        [2, 4, 1],
        [2.5, 4, 0.5],
        [3, 4, 0],
        [0, 0.5, 3, 3.5],
        [0, 1, 3, 3],
        [0, 1.5, 3, 2.5],
        [0, 2, 3, 2],
        [0, 2.5, 3, 1.5],
        [0, 3, 3, 1],
        [0, 3.5, 3, 0.5]
    ];

    let step = 0;

    function animateDashArray() {
        step = (step + 1) % dashArraySequence.length;
        if (map.getLayer(layerId)) {
            map.setPaintProperty(layerId, 'line-dasharray', dashArraySequence[step]);
            requestAnimationFrame(animateDashArray);
        }
    }

    animateDashArray();
}

/**
 * Remove journey layer
 * @param {mapboxgl.Map} map - Mapbox map instance
 * @param {string} journeyId - Journey identifier
 */
export function removeJourneyLayer(map, journeyId) {
    const sourceId = `journey-${journeyId}`;
    const layerId = `journey-line-${journeyId}`;
    const markersLayerId = `journey-markers-${journeyId}`;

    if (map.getLayer(markersLayerId)) map.removeLayer(markersLayerId);
    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(`${sourceId}-points`)) map.removeSource(`${sourceId}-points`);
    if (map.getSource(sourceId)) map.removeSource(sourceId);
}

/**
 * Format coordinates for display
 * @param {Array} coordinates - [longitude, latitude]
 * @returns {string} Formatted coordinates
 */
export function formatCoordinates(coordinates) {
    const lat = coordinates[1].toFixed(4);
    const lng = coordinates[0].toFixed(4);
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat)}°${latDir}, ${Math.abs(lng)}°${lngDir}`;
}
