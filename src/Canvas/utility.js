var min_x;
var max_x;
var min_y;
var max_y;

export const computeWindowSize = () => {
	const {innerWidth, innerHeight} = window;
	const coord = computeCoordinates(innerWidth, innerHeight);

	return {
		width: coord.x,
		height: coord.y,
		min_x,
		max_x,
		min_y,
		max_y,
	}
};


export const computeCoordinates = (x, y) => {
	return {
		x: computePosition(x),
		y: computePosition(y),
	}
};


export const computePosition = (x) => {
	const {devicePixelRatio} = window;
	const dpr = devicePixelRatio || 1;
	return x * dpr;
};


export const createShape = (origin, scale, vertices) => {
	const shape = new Path2D();

	shape.moveTo(
		origin.x + scale * vertices[0][0],
		origin.y + scale * vertices[0][1] * -1
	);

	vertices.slice(1).forEach((vertex) => {
		shape.lineTo(
			origin.x + scale * vertex[0],
			origin.y + scale * vertex[1] * -1
		);
	});

	shape.closePath();
	return shape;
};


export const computeEdges = (vertices) => {
	const edges = [];
	const N = vertices.length;

	for (let i = 0; i < N; i++) {
		const vertex1 = vertices[i];
		const vertex2 = vertices[(i + 1) % N];
		edges.push([
			vertex2[0] - vertex1[0],
			vertex2[1] - vertex1[1]
		]);
	}

	return edges;
};


export const computeNormals = (edges) => {
	return edges.map(
		(edge) => {
			const n = [-edge[1], edge[0]];
			const m = Math.sqrt((n[0]*n[0] + n[1]*n[1]));
			return [n[0]/m, n[1]/m];
		}
	)
};


export const computeAxesOfSeparation = (normals) => {
	const mapping = {};

	normals.forEach((normal) => {
		// Invert normal when X axis is negative.
		const axis = (normal[0] < 0 || normal[1] <= -1)
			? [-normal[0], -normal[1]] : normal;

		// Add to mapping with unique ID to prevent duplicate.
		mapping[axis.join()] = axis
	});

	return Object.values(mapping)
};


export const computeProjection = (vertices, normal) => {
	let [minimum, maximum] = [+Infinity, -Infinity];

	vertices.forEach((vertex) => {
		const projection = vertex[0] * normal[0] + vertex[1] * normal[1];
		minimum = Math.min(minimum, projection);
		maximum = Math.max(maximum, projection);
	});

	return [minimum, maximum];
};


export const drawGrid = (context, origin, width, height, scale) => {
	context.setLineDash([]);

	context.lineWidth = 1;
	context.strokeStyle = "#e9e9e9";
	context.globalAlpha = 1;

	// Draw grid lines along X axis.
	for (let index = 0; ; index += 1) {
		const y = origin.y + (scale * index);
		if (y > Math.floor(height))
			break;

		context.beginPath();
		context.moveTo(0, y);
		context.lineTo(width, y);
		context.stroke();
	}

	for (let index = 1; ; index += 1) {
		const y = origin.y - (scale * index);
		if (y < 0)
			break;

		context.beginPath();
		context.moveTo(0, y);
		context.lineTo(width, y);
		context.stroke();
	}

	// Draw grid lines along Y axis.
	for (let index = 0; ; index += 1) {
		const x = origin.x + (scale * index);
		if (x > Math.floor(width))
			break;

		context.beginPath();
		context.moveTo(x, 0);
		context.lineTo(x, height);
		context.stroke();
	}

	for (let index = 1; ; index += 1) {
		const x = origin.x - (scale * index);
		if (x < 0)
			break;

		context.beginPath();
		context.moveTo(x, 0);
		context.lineTo(x, height);
		context.stroke();
	}

	// Draw origin lines
	context.lineWidth = 2;
	context.strokeStyle = "#000";

	context.beginPath();
	context.moveTo(0, origin.y);
	context.lineTo(width, origin.y);
	context.stroke();

	context.beginPath();
	context.moveTo(origin.x, 0);
	context.lineTo(origin.x, height);
	context.stroke();

	// Draw numbers.
	context.font = "16px 'Inter'";
	context.lineWidth = 3;
	context.strokeStyle = "#FFF";
	context.fillStyle = "#000";
	context.textAlign = "center";
	context.textBaseline = "middle";

	// Ticks numbers along the X axis.
	for (let index = 1; ; index += 1) {
		let x = origin.x + (scale * index);
		if (x > Math.floor(width)) {
			max_x = index;
			break;
		}

		var placeY = getPlaceY(context, origin, height);
		placeText(context, index, x, placeY, scale);
	}

	for (let index = 1; ; index += 1) {
		const x = origin.x - (scale * index);
		if (x < 0) {
			min_x = -index;
			break;
		}

		var placeY = getPlaceY(context, origin, height);
		placeText(context, -index, x, placeY, scale);
	}

	// Ticks numbers along the Y axis.
	for (let index = 1; ; index += 1) {
		const y = origin.y + (scale * index);
		if (y > Math.floor(height)) {
			min_y = -index;
			break;
		}

		var placeX = getPlaceX(context, origin, width);
		placeText(context, -index, placeX, y, scale);
	}

	for (let index = 1; ; index += 1) {
		const y = origin.y - (scale * index);
		if (y < 0) {
			max_y = index;
			break;
		}

		var placeX = getPlaceX(context, origin, width);
		placeText(context, index, placeX, y, scale);
	}
};


export const drawShape = (context, shape, hover) => {
	context.setLineDash([]);
	context.lineWidth = 1;
	context.globalAlpha = 0.8;
	context.strokeStyle = "#575757";
	context.fillStyle = hover ? "#b8c1ff" : "#d0dcff";

	context.fill(shape);
	context.stroke(shape);
};


export const drawAxes = (context, origin, width, height, axes) => {
	context.setLineDash([20, 10]);
	context.strokeStyle = "#3f51b5";
	context.lineWidth = 3;
	context.globalAlpha = 1;

	const scale = Math.max(width, height);

	axes.forEach((axis) => {
		context.beginPath();
		context.moveTo(origin.x, origin.y);
		context.lineTo(
			origin.x + scale * axis[0],
			origin.y + scale * axis[1] * -1
		);
		context.stroke();

		context.beginPath();
		context.moveTo(origin.x, origin.y);
		context.lineTo(
			origin.x + scale * axis[0] * -1,
			origin.y + scale * axis[1]
		);
		context.stroke();

	})
};


export const drawProjections = (context, origin, scale, objects) => {
	context.setLineDash([]);
	context.lineWidth = 10;

	objects.forEach((object) => {
		switch(object["type"]) {
			case "point":
				context.fillStyle = "#ff7974";
				context.globalAlpha = 0.5;
				if(object.color !== undefined)
					context.fillStyle = object.color;
				context.beginPath();
				context.arc(origin.x+(scale*object.coordinates[0].x), origin.y-(scale*object.coordinates[0].y), scale/6, 0, 2 * Math.PI);
				context.fill(); 
				context.beginPath();
				context.arc(origin.x+(scale*object.coordinates[0].x), origin.y-(scale*object.coordinates[0].y), scale/10, 0, 2 * Math.PI);
				context.fill();
				context.fillStyle = "#000000"
				context.globalAlpha = 1;
				break;
			case "function":
				plot(object.function, object.color, context, scale, origin);
				break;
			default:
				break;
		}
	});
};

function plot(func, color, context, scale, origin) {
	var invScale = 1 / scale;
	var subStep = invScale / 10;
	var yy; // previous Y value

	var top = max_y+1;
	var bottom = min_y-1;
	var start = min_x-1;
	var end = max_x+1;

	// set render styles
	context.strokeStyle = color;
	context.lineWidth = 2;

	context.beginPath();
	for(let x = start; x < end; x += invScale){ // pixel steps
		for(let subX = 0; subX < invScale; subX += subStep){  // sub steps
			let y = func(x+subX);            // get y for x 
			if(yy !== undefined){            // is this not the first point
				if(y > top || y < bottom){     // this y outside ?
					if(yy < top && yy > bottom){ // last yy inside?
						context.lineTo(origin.x+(scale*(x+subX)),origin.y-(scale*y));
					}
				} else {
					if(subX === 0){              // are we at a pixel 
						if(y > bottom && y < top){  // are we inside
							if(Math.abs(yy-y) > (top - bottom) * (1/3)){ 
								context.moveTo(origin.x+(scale*x),origin.y-(scale*y));  
							}else{
								context.lineTo(origin.x+(scale*x),origin.y-(scale*y));
							}
						}
					}
				}
			} else if(subX === 0) {
				context.moveTo(origin.x+(scale*x),origin.y-(scale*y));
			}
			yy  = y;
		}
	}
	context.stroke();
}

function getPlaceX(context, origin, width) {
	var placeX = origin.x - 25;
	if(origin.x < 40) {
		placeX = 15;
		context.fillStyle = "#888"
	} else if (origin.x > width) {
		placeX = width-25;
		context.fillStyle = "#888"
	}
	return placeX;
}

function getPlaceY(context, origin, height) {
	var placeY = origin.y + 30;
	if(origin.y < -10) {
		placeY = 20;
		context.fillStyle = "#888"
	} else if (origin.y+30 > height-20) {
		placeY = height-20;
		context.fillStyle = "#888"
	}
	return placeY;
}

function placeText(context, index, x, y, scale) {
	if(scale >= 50) {
		context.strokeText(`${index}`, x, y);
		context.fillText(`${index}`, x, y);
	} else if (scale < 50 && index%Math.pow(2, Math.floor(1/(Math.log(scale)/Math.log(50)))) === 0) {
		context.strokeText(`${index}`, x, y);
		context.fillText(`${index}`, x, y);
	}
} 