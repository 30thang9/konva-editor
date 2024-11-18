class BaseScene extends Konva.Group {
	static sceneId = "BaseScene";

	/**
	 * @private
	 * @type {Konva.Stage}
	 */
	_stage;

	/**
	 * @private
	 * @type {SceneManager}
	 */
	_sceneManager;

	/**
	 * @private
	 * @type {Map<string, Konva.Transformer>}
	 */
	_transformers;

	constructor(stage, sceneManager) {
		super();
		this._stage = stage;
		this._sceneManager = sceneManager;

		// Initialize transformers mapping
		this._transformers = new Map();

		// Register supported transformers
		this._registerTransformer(ConstantType.IMAGE, new ScaleTransformer());
		this._registerTransformer(
			ConstantType.TEXT,
			new ScaleTransformer({
				enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right", "middle-left", "middle-right"],
			})
		);

		this._handlePointerDown = this._handlePointerDown.bind(this);
		this._handleDoubleClick = this._handleDoubleClick.bind(this);
		this._handleTransformStart = this._handleTransformStart.bind(this);
	}

	/**
	 * Register a transformer for a specific node type.
	 * @private
	 * @param {string} nodeType - Node type (e.g., "Image", "Text").
	 * @param {Konva.Transformer} transformer - Transformer instance.
	 */
	_registerTransformer(nodeType, transformer) {
		this._transformers.set(nodeType, transformer);
		this.add(transformer);
	}

	/**
	 * @private
	 */
	_registerEvents() {
		this._stage.on("pointerdown", this._handlePointerDown);
		this._stage.on("pointerdblclick", this._handleDoubleClick);
		for (const transformer of this._transformers.values()) {
			transformer.on("transformstart", this._handleTransformStart);
		}
	}

	/**
	 * @private
	 */
	_unbindEvents() {
		this._stage.off("pointerdown", this._handlePointerDown);
		this._stage.off("pointerdblclick", this._handleDoubleClick);
		for (const transformer of this._transformers.values()) {
			transformer.off("transformstart", this._handleTransformStart);
		}
	}

	/**
	 * @private
	 */
	_handlePointerDown({ target }) {
		if (target.hasName("_anchor")) {
			return;
		}

		const nodeType = target.className;
		if (this._transformers.has(nodeType)) {
			const isSelected = this.getSelection() === target;
			if (!isSelected) {
				this.setSelection(target);
			}
		} else {
			this.setSelection(null);
		}
	}

	/**
	 * @private
	 */
	_handleDoubleClick(e) {
		const selection = this.getSelection();
		if (e.target === selection) {
			if (selection.className === ConstantType.IMAGE) {
				this._sceneManager.goto(CropScene);
			} else if (selection.className === ConstantType.TEXT) {
				this._sceneManager.goto(TextScene);
			}
		}
	}

	/**
	 * @private
	 */
	_handleTransformStart = () => {
		const selection = this.getSelection();
	
		if (!selection) {
			return;
		}
	
		const nodeType = selection.className;
		const transformer = this._transformers.get(nodeType);
	
		if (!transformer) {
			return; // No transformer registered for this node type
		}
	
		const activeAnchor = transformer.getActiveAnchor();
		if (selection.handleTransformStart) {
			selection.handleTransformStart(activeAnchor);
		}
	
		// Transform handler
		const transformHandler = () => {
			if (selection.handleTransform) {
				selection.handleTransform(activeAnchor);
			}
		};
	
		// Transform end handler
		const transformEndHandler = () => {
			transformer.off("transform", transformHandler);
			transformer.off("transformend", transformEndHandler);
	
			if (selection.handleTransformEnd) {
				selection.handleTransformEnd(activeAnchor);
			}
		};
	
		transformer.on("transform", transformHandler);
		transformer.on("transformend", transformEndHandler);
	};
	

	hide() {
		super.hide();
		this._unbindEvents();
	}

	show() {
		super.show();
		this._registerEvents();
	}

	/**
	 * Get the currently selected node.
	 * @returns {Konva.Node|null}
	 */
	getSelection() {
		for (const transformer of this._transformers.values()) {
			const nodes = transformer.nodes();
			if (nodes.length > 0) {
				return nodes[0];
			}
		}
		return null;
	}

	/**
	 * Set the current selection.
	 * @param {Konva.Node|null} target
	 */
	setSelection(target) {
		// Clear all transformers
		for (const transformer of this._transformers.values()) {
			transformer.nodes([]);
		}

		if (!target) {
			return;
		}

		// Set the target node in its corresponding transformer
		const nodeType = target.className;
		const transformer = this._transformers.get(nodeType);

		if (transformer) {
			transformer.nodes([target]);
		}else{
			console.log('No transformer found for node type:', nodeType);
		}
	}

}
