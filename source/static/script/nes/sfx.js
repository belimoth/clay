"use strict";

export function sfx_init() {
	const audioCtx = new AudioContext();
	const analyser = audioCtx.createAnalyser();

	const source = audioCtx.createMediaStreamSource(stream);
	source.connect(analyser);
	analyser.connect(distortion);
	distortion.connect(audioCtx.destination);

	app.sfx = {};
	app.sfx.el =
}

export function sfx_draw() {

	analyser.fftSize = 2048;
	const bufferLength = analyser.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);

	canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

	function draw() {
		const drawVisual = requestAnimationFrame(draw);
		analyser.getByteTimeDomainData(dataArray);
		// Fill solid color
		canvasCtx.fillStyle = "rgb(200 200 200)";
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
		// Begin the path
		canvasCtx.lineWidth = 2;
		canvasCtx.strokeStyle = "rgb(0 0 0)";
		canvasCtx.beginPath();
		// Draw each point in the waveform
		const sliceWidth = WIDTH / bufferLength;
		let x = 0;

		for (let i = 0; i < bufferLength; i++) {
			const v = dataArray[i] / 128.0;
			const y = v * (HEIGHT / 2);

			if (i === 0) {
				canvasCtx.moveTo(x, y);
			} else {
				canvasCtx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		// Finish the line
		canvasCtx.lineTo(WIDTH, HEIGHT / 2);
		canvasCtx.stroke();
	}
}

draw();
