import React, { useState } from "react";
import Canvas from "../Canvas/index.js";

export default function App() {
	const [objects, setObjects] = useState([
		{
			type: "point",
			coordinates: [{
				x: 1,
				y: 1,
			}],
			color: "#000000",
		},
		{
			type: "function",
			function: (x)=>Math.pow(x, 5)+Math.pow(x, 4)+Math.pow(x, 3)+Math.pow(x, 2)*15 + 12*x - 5,
			color: "#000000",
		},
		{
			type: "function",
			function: (x)=>x - 5,
			color: "#62fc79",
		},
		{
			type: "function",
			function: (x)=>x*x - 5,
			color: "#fc7c62",
		},
		{
			type: "function",
			function: (x)=>x - 5*x,
			color: "#628efc",
			lineWidth: 4,
		},
		{
			type: "vector",
			coordinates: {
				start: {
					x: 0,
					y: 0,
				},
				end: {
					x: 5,
					y: 3,
				},
			},
			color: "#d5a2d6",
			lineWidth: 2,
		}
	]);

	return (
		<div className="App">
			<Canvas
				verticesList={objects}
				gridVisible={true}
				axesVisible={true}
			/>
		</div>
	);
}

