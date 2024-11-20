class TransformerFactory {
    static createTransformer(nodeType) {
        switch (nodeType) {
            case ConstantType.IMAGE:
                return new ScaleTransformer();
            case ConstantType.TEXT:
                return new ScaleTransformer({
                    enabledAnchors: [
                        "top-left",
                        "top-right",
                        "bottom-left",
                        "bottom-right",
                        "middle-left",
                        "middle-right",
                    ],
                });
            default:
                return new ScaleTransformer();
        }
    }
}
