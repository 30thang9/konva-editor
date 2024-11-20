class StateManager {
    constructor() {
        this.undoStack = []; // Lưu các trạng thái trước đó
        this.redoStack = []; // Lưu các trạng thái đã undo
    }

    /**
     * Lưu trạng thái hiện tại của canvas
     * @param {Konva.Stage} stage
     */
    saveState(stage) {
        const state = stage.toJSON(); // Serialize stage to JSON
        this.undoStack.push(state);
        this.redoStack = []; // Clear redo stack mỗi khi có thay đổi mới
    }

    /**
     * Hoàn tác (Undo) trạng thái
     * @param {Konva.Stage} stage
     */
    undo(stage) {
        if (this.undoStack.length === 0) {
            console.warn("Không có trạng thái để hoàn tác.");
            return;
        }
        const currentState = stage.toJSON();
        this.redoStack.push(currentState); // Lưu trạng thái hiện tại vào redoStack
        const previousState = this.undoStack.pop(); // Lấy trạng thái trước đó
        this._restoreState(stage, previousState);
    }

    /**
     * Làm lại (Redo) trạng thái
     * @param {Konva.Stage} stage
     */
    redo(stage) {
        if (this.redoStack.length === 0) {
            console.warn("Không có trạng thái để làm lại.");
            return;
        }
        const currentState = stage.toJSON();
        this.undoStack.push(currentState); // Lưu trạng thái hiện tại vào undoStack
        const nextState = this.redoStack.pop(); // Lấy trạng thái tiếp theo
        this._restoreState(stage, nextState);
    }

    /**
     * Phục hồi trạng thái của canvas
     * @private
     * @param {Konva.Stage} stage
     * @param {string} state
     */
    _restoreState(stage, state) {
        stage.destroyChildren(); // Xóa toàn bộ children hiện tại
        const newStage = Konva.Node.create(state, stage.container()); // Khôi phục từ JSON
        stage.add(...newStage.children); // Thêm lại các children
        stage.draw(); // Vẽ lại canvas
    }
}
