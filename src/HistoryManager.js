class HistoryManager {
    constructor() {
        this.history = [];
        this.redoHistory = [];
    }

    // Lưu trạng thái của toàn bộ stage
    saveState(stage) {
        const state = {
            objects: stage.children.map(child => this._getObjectState(child)),
        };
        this.history.push(state);
        this.redoHistory = []; // Clear redo history when new state is saved
    }

    // Lấy trạng thái của từng đối tượng
    _getObjectState(node) {
        return {
            type: node.className,
            x: node.x(),
            y: node.y(),
            width: node.width(),
            height: node.height(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            opacity: node.opacity(),
            name: node.name(),
            // Thêm các thuộc tính khác nếu cần
        };
    }

    // Phục hồi trạng thái của đối tượng
    restoreState(stage, state) {
        state.objects.forEach((objState, index) => {
            const node = stage.children[index];
            this._setObjectState(node, objState);
        });
        stage.batchDraw();
    }

    // Thiết lập trạng thái cho đối tượng
    _setObjectState(node, state) {
        node.position({ x: state.x, y: state.y });
        node.size({ width: state.width, height: state.height });
        node.rotation(state.rotation);
        node.scale({ x: state.scaleX, y: state.scaleY });
        node.opacity(state.opacity);
        node.name(state.name);
        // Thiết lập các thuộc tính khác nếu cần
    }

    // Undo thao tác (phục hồi trạng thái trước đó)
    undo(stage) {
        if (this.history.length === 0) return;
        const state = this.history.pop();
        this.redoHistory.push(state);
        this.restoreState(stage, state);
    }

    // Redo thao tác (quay lại trạng thái sau)
    redo(stage) {
        if (this.redoHistory.length === 0) return;
        const state = this.redoHistory.pop();
        this.history.push(state);
        this.restoreState(stage, state);
    }
}
