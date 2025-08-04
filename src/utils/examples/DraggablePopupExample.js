/**
 * DraggablePopup 使用示例
 */

// 创建基本弹窗
function createBasicPopup(viewer) {
    // 创建锚点位置（这里以北京的坐标为例）
    const position = Cesium.Cartesian3.fromDegrees(116.397428, 39.90923, 100);

    // 创建弹窗
    const popup = new DraggablePopup(viewer, {
        position: position,
        content: '<div>这是一个可拖拽的弹窗</div>',
        offsetY: -50, // 向上偏移50像素
    });

    // 显示弹窗
    popup.show();

    return popup;
}

// 创建带有自定义样式的弹窗
function createStyledPopup(viewer) {
    const position = Cesium.Cartesian3.fromDegrees(116.397428, 39.90923, 100);

    // 自定义样式
    const customStyle = {
        backgroundColor: 'rgba(40, 44, 52, 0.9)',
        color: '#fff',
        borderRadius: '8px',
        padding: '15px',
        minWidth: '200px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    };

    // 自定义连线样式
    const customLineStyle = {
        width: 3,
        material: new Cesium.Material.fromType('Color', {
            color: Cesium.Color.YELLOW.withAlpha(0.8)
        })
    };

    const popup = new DraggablePopup(viewer, {
        position: position,
        content: '<div>自定义样式的弹窗</div>',
        style: customStyle,
        lineStyle: customLineStyle
    });

    popup.show();
    return popup;
}

// 创建带有复杂内容的弹窗
function createComplexPopup(viewer) {
    const position = Cesium.Cartesian3.fromDegrees(116.397428, 39.90923, 100);

    // 创建复杂的HTML内容
    const content = document.createElement('div');
    content.innerHTML = `
        <div style="padding: 10px;">
            <h3 style="margin: 0 0 10px 0;">位置信息</h3>
            <div style="margin-bottom: 5px;">
                <strong>经度：</strong> 116.397428°E
            </div>
            <div style="margin-bottom: 5px;">
                <strong>纬度：</strong> 39.90923°N
            </div>
            <div style="margin-bottom: 10px;">
                <strong>高度：</strong> 100m
            </div>
            <button onclick="updatePopupContent()" style="
                background: #409EFF;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
            ">更新内容</button>
        </div>
    `;

    const popup = new DraggablePopup(viewer, {
        position: position,
        content: content,
        style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '8px',
            boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)'
        }
    });

    popup.show();
    return popup;
}

// 创建动态更新内容的弹窗
function createDynamicPopup(viewer) {
    const position = Cesium.Cartesian3.fromDegrees(116.397428, 39.90923, 100);
    
    const popup = new DraggablePopup(viewer, {
        position: position,
        content: '<div>加载中...</div>'
    });

    // 模拟异步数据加载
    setTimeout(() => {
        popup.setContent(`
            <div style="padding: 10px;">
                <h3>实时数据</h3>
                <div>温度：25°C</div>
                <div>湿度：65%</div>
                <div>风速：3m/s</div>
            </div>
        `);
    }, 1000);

    popup.show();
    return popup;
}

// 完整的使用示例
function fullExample(viewer) {
    // 创建多个弹窗
    const popup1 = createBasicPopup(viewer);
    const popup2 = createStyledPopup(viewer);
    const popup3 = createComplexPopup(viewer);
    const popup4 = createDynamicPopup(viewer);

    // 调整位置，避免重叠
    popup2.setPosition(Cesium.Cartesian3.fromDegrees(116.398428, 39.90923, 100));
    popup3.setPosition(Cesium.Cartesian3.fromDegrees(116.396428, 39.90923, 100));
    popup4.setPosition(Cesium.Cartesian3.fromDegrees(116.397428, 39.91023, 100));

    // 示例：动态更新内容
    setInterval(() => {
        popup4.setContent(`
            <div style="padding: 10px;">
                <h3>实时数据</h3>
                <div>温度：${Math.round(20 + Math.random() * 10)}°C</div>
                <div>湿度：${Math.round(50 + Math.random() * 30)}%</div>
                <div>风速：${(2 + Math.random() * 3).toFixed(1)}m/s</div>
                <div>更新时间：${new Date().toLocaleTimeString()}</div>
            </div>
        `);
    }, 3000);

    // 示例：响应场景事件
    viewer.screenSpaceEventHandler.setInputAction((movement) => {
        const cartesian = viewer.scene.pickPosition(movement.position);
        if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            
            popup1.setContent(`
                <div style="padding: 5px;">
                    <div>经度：${longitude.toFixed(6)}°</div>
                    <div>纬度：${latitude.toFixed(6)}°</div>
                    <div>高度：${cartographic.height.toFixed(2)}m</div>
                </div>
            `);
            popup1.setPosition(cartesian);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return {
        popup1,
        popup2,
        popup3,
        popup4,
        // 清理函数
        cleanup: () => {
            popup1.destroy();
            popup2.destroy();
            popup3.destroy();
            popup4.destroy();
        }
    };
}

/**
 * 使用说明：
 * 
 * 1. 基本使用：
 * ```javascript
 * const popup = new DraggablePopup(viewer, {
 *     position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
 *     content: '弹窗内容'
 * });
 * popup.show();
 * ```
 * 
 * 2. 自定义样式：
 * ```javascript
 * const popup = new DraggablePopup(viewer, {
 *     position: position,
 *     content: content,
 *     style: {
 *         backgroundColor: 'rgba(40, 44, 52, 0.9)',
 *         color: '#fff',
 *         borderRadius: '8px'
 *     },
 *     lineStyle: {
 *         width: 3,
 *         material: Cesium.Color.YELLOW.withAlpha(0.8)
 *     }
 * });
 * ```
 * 
 * 3. 动态更新：
 * ```javascript
 * // 更新内容
 * popup.setContent('新内容');
 * 
 * // 更新位置
 * popup.setPosition(newPosition);
 * 
 * // 更新样式
 * popup.setStyle({ backgroundColor: 'red' });
 * 
 * // 更新连线样式
 * popup.setLineStyle({ width: 5 });
 * ```
 * 
 * 4. 显示/隐藏：
 * ```javascript
 * popup.show();  // 显示弹窗
 * popup.hide();  // 隐藏弹窗
 * ```
 * 
 * 5. 清理：
 * ```javascript
 * popup.destroy();  // 销毁弹窗
 * ```
 */