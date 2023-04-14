document.getElementById('conversionForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const svgInput = document.getElementById('svgInput').value;
    convertSVGtoHTML(svgInput);
});
function convertSVGtoHTML(svgString) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElements = svgDoc.documentElement.getElementsByTagName('*');
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';

    for (let i = 0; i < svgElements.length; i++) {
        let element = svgElements[i];

        if (element.tagName === 'rect') {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.width = element.getAttribute('width') + 'px';
            div.style.height = element.getAttribute('height') + 'px';
            div.style.left = element.getAttribute('x') + 'px';
            div.style.top = element.getAttribute('y') + 'px';
            div.style.backgroundColor = element.getAttribute('fill') || '#000';

            resultContainer.appendChild(div);
        } else if (element.tagName === 'circle') {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.width = (element.getAttribute('r') * 2) + 'px';
            div.style.height = (element.getAttribute('r') * 2) + 'px';
            div.style.left = (element.getAttribute('cx') - element.getAttribute('r')) + 'px';
            div.style.top = (element.getAttribute('cy') - element.getAttribute('r')) + 'px';
            div.style.borderRadius = '50%';
            div.style.backgroundColor = element.getAttribute('fill') || '#000';

            resultContainer.appendChild(div);
        } else if (element.tagName === 'polygon') {
            const points = element.getAttribute('points').split(' ').map(pair => pair.split(','));
            const minX = Math.min(...points.map(point => parseFloat(point[0])));
            const minY = Math.min(...points.map(point => parseFloat(point[1])));

            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.left = `${minX}px`;
            div.style.top = `${minY}px`;

            const svgWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgWrapper.setAttribute('width', '100%');
            svgWrapper.setAttribute('height', '100%');
            svgWrapper.setAttribute('viewBox', `${minX} ${minY} ${element.getBBox().width} ${element.getBBox().height}`);

            const newPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            newPolygon.setAttribute('points', element.getAttribute('points'));
            newPolygon.setAttribute('fill', element.getAttribute('fill') || '#000');

            svgWrapper.appendChild(newPolygon);
            div.appendChild(svgWrapper);
            resultContainer.appendChild(div);
        }
    }
}

