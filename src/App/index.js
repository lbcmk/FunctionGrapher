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
		},
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

