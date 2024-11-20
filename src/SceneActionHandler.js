class SceneActionHandler {
    static handleDoubleClick(node, sceneManager) {
        if (!node) return;

        switch (node.className) {
            case ConstantType.IMAGE:
                sceneManager.goto(CropScene);
                break;
            case ConstantType.TEXT:
                sceneManager.goto(TextScene);
                break;
            default:
                console.log("No action defined for this node type.");
        }
    }
}
