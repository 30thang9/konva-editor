function bootstrap() {
	if (!Konva) {
		throw new Error("Konva is not defined");
	}
	const container = document.getElementById("konva-container");
	const stage = new Konva.Stage({
		container,
		width: container.offsetWidth,
		height: container.offsetHeight,
	});
	const layer = new Konva.Layer();
	stage.add(layer);
	const imageView = new Konva.Group();
	const sceneManager = new SceneManager(stage);
	layer.add(imageView, sceneManager);

	const stateManager = new StateManager();
	stateManager.saveState(stage); // Save the initial state

	sceneManager.goto(BaseScene);

	document.getElementById("button-image-upload").addEventListener("click", function(e) {
		document.getElementById("image-upload").click();
	});

	document.getElementById("image-upload").addEventListener("change", (e) => {
		const file = e.target.files[0];
		if (!file) {
			return;
		}
		e.target.value = "";
		const objectUrl = URL.createObjectURL(file);
		const img = new Image();
		img.src = objectUrl;
		img.onload = () => {
			URL.revokeObjectURL(objectUrl);

			// adapt to canvas
			const padding = 12;
			const scaleX = (container.offsetWidth - padding * 2) / img.width;
			const scaleY = (container.offsetHeight - padding * 2) / img.height;
			let scale = scaleX < scaleY ? scaleX : scaleY;
			if (scale > 1) {
				scale = 1;
			}
			const width = img.width * scale;
			const height = img.height * scale;
			const x = container.offsetWidth / 2 - width / 2;
			const y = container.offsetHeight / 2 - height / 2;
			const konvaImage = new Konva.Image({ x, y, width, height, image: img });
			imageView.add(konvaImage);
			sceneManager.getScene(BaseScene).setSelection([konvaImage]);

			stateManager.saveState(stage); // Save the state after adding an image
		};
	});

	document.getElementById("add-text").addEventListener("click", function(e) {
		const konvaText = new Konva.Text({
			text: 'Text Sample',
			x: 100,
			y: 100,
			fontSize: 26,
			fontFamily: 'Arial',
			fill: 'blue',
		});
		imageView.add(konvaText);
		sceneManager.getScene(BaseScene).setSelection([konvaText]);

		stateManager.saveState(stage); // Save the state after adding text
	});

	document.getElementById("undo").addEventListener("click", function() {
		stateManager.undo(stage); // Undo the last state
		layer.batchDraw();
	});

	document.getElementById("redo").addEventListener("click", function() {
		stateManager.redo(stage); // Redo the last undone state
		layer.batchDraw();
	});
}

bootstrap();
