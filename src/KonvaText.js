class KonvaText extends Konva.Text {
    /**
     * Minimum width for the text element
     * @constant
     * @type {number}
     */
    static MIN_WIDTH = 20;

    /**
     * last size
     * @private
     * @type {{width: number, height: number}}
     */
    _lastSize;

    constructor(config) {
        super(config);
        this.draggable(true); // Cho phép kéo thả
        this._lastSize = this.size(); // Lưu kích thước ban đầu
    }

    /**
     * before transform
     */
    handleTransformStart() {
        this._lastSize = this.size(); // Lưu lại kích thước hiện tại khi bắt đầu thay đổi
    }

    /**
     * transforming
     * @param {string} activeAnchor
     */
    handleTransform(activeAnchor) {
        // Gọi hàm xử lý resize
        this.handleResize(this.size(), this._lastSize, activeAnchor);
    }

    /**
     * after transform
     */
    handleTransformEnd() {
        this._lastSize = null; // Reset kích thước cuối cùng sau khi transform
    }

    /**
     * Keep ratio when scaling
     * @param {typeof this._lastSize} curSize - Kích thước hiện tại
     * @param {typeof this._lastSize} lastSize - Kích thước trước đó
     * @param {string} anchor - Điểm đang kéo
     */
    handleResize(curSize, lastSize, anchor) {
        let newWidth = curSize.width;
        let lastWidth = lastSize.width;

        if (anchor === "middle-left" || anchor === "middle-right") {
            if (newWidth > lastWidth) {
                this.align('center');
            }

            this.setAttrs({
                width: Math.max(newWidth * this.scaleX(), KonvaText.MIN_WIDTH),
                scaleX: 1,
                scaleY: 1,
            });
        } else if (
            anchor === "top-right" ||
            anchor === "top-left" ||
            anchor === "bottom-left" ||
            anchor === "bottom-right"
        ) {

        }
    }
}
