/**
 * NHS SDE Layer Integration
 */

// Create custom SDE marker with cylinder icon
const createSDEMarkerElement = () => {
    const div = document.createElement('div');
    div.style.width = '24px';
    div.style.height = '32px';
    div.style.backgroundImage = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32"><defs><style>.cyl-side{fill:%237b68ee}.cyl-top{fill:%239370db}</style></defs><ellipse cx="12" cy="6" rx="8" ry="4" class="cyl-top"/><rect x="4" y="6" width="16" height="16" class="cyl-side"/><ellipse cx="12" cy="22" rx="8" ry="4" class="cyl-top"/></svg>')`;
    div.style.backgroundSize = 'contain';
    div.style.backgroundRepeat = 'no-repeat';
    div.style.cursor = 'pointer';
    div.className = 'sde-marker';
    return div;
};

// Fetch and add SDE layer
fetch('sde-locations.geojson')
    .then(response => response.json())
    .then(sdeData => {
        const sdeMarkers = {};
        
        sdeData.features.forEach(feature => {
            const coords = feature.geometry.coordinates;
            const props = feature.properties;
            
            // Create popup HTML
            const dataList = props.data.map(d => `<li>${d}</li>`).join('');
            const popupHTML = `
                <div style="padding: 12px; border-left: 4px solid #7b68ee; max-width: 380px; font-family: Arial, sans-serif;">
                    <h4 style="color: #7b68ee; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">
                        <a href="${props.url}" target="_blank" style="color: #7b68ee; text-decoration: none;">
                            ${props.name} →
                        </a>
                    </h4>
                    <p style="margin: 8px 0; font-size: 12px; font-weight: bold; color: #333;">${props.location}</p>
                    <div style="margin: 10px 0 0 0; font-size: 11px; color: #555;">
                        <strong>Data Included:</strong>
                        <ul style="margin: 6px 0 0 16px; padding: 0; list-style: disc;">
                            ${dataList}
                        </ul>
                    </div>
                </div>
            `;
            
            // Create marker with popup
            const popup = new maplibregl.Popup({offset: 30})
                .setHTML(popupHTML);
            
            const marker = new maplibregl.Marker({
                element: createSDEMarkerElement()
            })
                .setLngLat(coords)
                .setPopup(popup)
                .addTo(map);
            
            marker.featureData = props;
            sdeMarkers[props.name] = marker;
        });
        
        // Add SDE toggle checkbox handler
        const sdeCheckbox = document.getElementById('layer-sdes');
        if (sdeCheckbox) {
            sdeCheckbox.addEventListener('change', (e) => {
                Object.values(sdeMarkers).forEach(marker => {
                    marker.getElement().style.display = e.target.checked ? 'block' : 'none';
                });
            });
        }
        
        console.log(`✓ SDE layer loaded with ${sdeData.features.length} locations`);
    })
    .catch(err => console.error('Error loading SDE data:', err));
