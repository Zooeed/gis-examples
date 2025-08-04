/**
 * 可拖拽的弹窗类
 * 实现了弹窗和锚点之间的连线，支持拖拽时动态更新连线
 */
import { Cesium } from '@/utils/ZMap';
export default class DraggablePopup {
  /**
   * 构造函数
   * @param {Object} viewer Cesium viewer实例
   * @param {Object} options 配置选项
   * @param {Cesium.Cartesian3} options.position 锚点位置
   * @param {String|HTMLElement} options.content 弹窗内容
   * @param {Object} [options.style] 弹窗样式
   * @param {Number} [options.offsetX=0] X轴偏移量
   * @param {Number} [options.offsetY=-20] Y轴偏移量
   * @param {Boolean} [options.showLine=true] 是否显示连线
   * @param {Object} [options.lineStyle] 连线样式
   */
  constructor(viewer, options) {
    this.viewer = viewer;
    this.options = Object.assign({
      offsetX: 0,
      offsetY: -20,
      showLine: true,
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
        maxWidth: '300px',
        boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
        fontSize: '14px',
        color: '#333',
        pointerEvents: 'auto'
      },
      lineStyle: {
        width: 2,
        material: new Cesium.Material.fromType('Color', {
          color: Cesium.Color.fromCssColorString('#409EFF').withAlpha(0.8)
        })
      }
    }, options);

    // 初始化属性
    this.position = this.options.position;
    this.container = null;
    this.line = null;
    this.isDragging = false;
    this.dragStartScreenPosition = null;
    this.initialScreenPosition = null;
    this.currentScreenPosition = null;

    // 创建弹窗
    this._createPopup();
    
    if (this.options.showLine) {
      // 创建连线
      this._createLine();
    }

    // 绑定事件
    this._bindEvents();
  }

  /**
   * 创建弹窗DOM元素
   * @private
   */
  _createPopup() {
    // 创建容器
    this.container = document.createElement('div');
    this.container.className = 'cesium-draggable-popup';
    Object.assign(this.container.style, this.options.style, {
      position: 'absolute',
      cursor: 'move'
    });

    // 设置内容
    if (typeof this.options.content === 'string') {
      this.container.innerHTML = this.options.content;
    } else if (this.options.content instanceof HTMLElement) {
      this.container.appendChild(this.options.content);
    }

    // 添加到viewer容器
    this.viewer.container.appendChild(this.container);

    // 更新位置
    this._updatePopupPosition();
  }

  /**
   * 创建连线实体
   * @private
   */
  _createLine() {
    this.line = this.viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          const popupPosition = this._getPopupWorldPosition();
          if (!popupPosition) return [];
          return [this.position, popupPosition];
        }, false),
        width: this.options.lineStyle.width,
        material: this.options.lineStyle.material
      }
    });
  }

  /**
   * 绑定事件
   * @private
   */
  _bindEvents() {
    // 鼠标按下事件
    this.container.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // 只响应左键
      this.isDragging = true;
      this.dragStartScreenPosition = new Cesium.Cartesian2(e.clientX, e.clientY);
      this.initialScreenPosition = this._getScreenPosition();
      
      // 阻止事件冒泡
      e.stopPropagation();
    });

    // 鼠标移动事件
    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;

      const currentX = e.clientX;
      const currentY = e.clientY;
      
      // 计算偏移量
      const offsetX = currentX - this.dragStartScreenPosition.x;
      const offsetY = currentY - this.dragStartScreenPosition.y;
      
      // 更新弹窗位置
      this.currentScreenPosition = new Cesium.Cartesian2(
        this.initialScreenPosition.x + offsetX,
        this.initialScreenPosition.y + offsetY
      );
      
      // 更新弹窗样式位置
      this.container.style.left = `${this.currentScreenPosition.x}px`;
      this.container.style.top = `${this.currentScreenPosition.y}px`;
    });

    // 鼠标松开事件
    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // 场景更新事件
    this.viewer.scene.postRender.addEventListener(() => {
      if (!this.isDragging) {
        this._updatePopupPosition();
      }
    });
  }

  /**
   * 更新弹窗位置
   * @private
   */
  _updatePopupPosition() {
    const screenPosition = this._getScreenPosition();
    if (!screenPosition) return;

    this.currentScreenPosition = screenPosition;
    this.container.style.left = `${screenPosition.x}px`;
    this.container.style.top = `${screenPosition.y}px`;
  }

  /**
   * 获取弹窗屏幕位置
   * @returns {Cesium.Cartesian2|null} 屏幕坐标
   * @private
   */
  _getScreenPosition() {
    // 将世界坐标转换为屏幕坐标
    const screenPosition = Cesium.SceneTransforms.worldToWindowCoordinates(
      this.viewer.scene,
      this.position
    );

    if (!screenPosition) return null;

    // 添加偏移量
    return new Cesium.Cartesian2(
      screenPosition.x + this.options.offsetX,
      screenPosition.y + this.options.offsetY
    );
  }

  /**
   * 获取弹窗当前的世界坐标
   * @returns {Cesium.Cartesian3|null} 世界坐标
   * @private
   */
  _getPopupWorldPosition() {
    if (!this.currentScreenPosition) return null;

    // 获取深度
    const depth = this.viewer.scene.globe.pick(
      this.viewer.camera.getPickRay(this.currentScreenPosition),
      this.viewer.scene
    );

    if (!depth) return null;

    // 计算世界坐标
    const cartographic = Cesium.Cartographic.fromCartesian(depth);
    cartographic.height += 10; // 添加一个高度偏移，避免被地形遮挡
    
    return Cesium.Cartographic.toCartesian(cartographic);
  }

  /**
   * 设置弹窗内容
   * @param {String|HTMLElement} content 弹窗内容
   */
  setContent(content) {
    if (typeof content === 'string') {
      this.container.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.container.innerHTML = '';
      this.container.appendChild(content);
    }
  }

  /**
   * 设置弹窗位置
   * @param {Cesium.Cartesian3} position 新的锚点位置
   */
  setPosition(position) {
    this.position = position;
    this._updatePopupPosition();
  }

  /**
   * 设置弹窗样式
   * @param {Object} style 样式对象
   */
  setStyle(style) {
    Object.assign(this.container.style, style);
  }

  /**
   * 设置连线样式
   * @param {Object} style 样式对象
   */
  setLineStyle(style) {
    if (!this.line) return;
    
    if (style.width !== undefined) {
      this.line.polyline.width = style.width;
    }
    if (style.material !== undefined) {
      this.line.polyline.material = style.material;
    }
  }

  /**
   * 显示弹窗
   */
  show() {
    this.container.style.display = 'block';
    if (this.line) {
      this.line.show = true;
    }
  }

  /**
   * 隐藏弹窗
   */
  hide() {
    this.container.style.display = 'none';
    if (this.line) {
      this.line.show = false;
    }
  }

  /**
   * 销毁弹窗
   */
  destroy() {
    // 移除DOM元素
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    // 移除连线实体
    if (this.line) {
      this.viewer.entities.remove(this.line);
    }

    // 移除事件监听
    this.viewer.scene.postRender.removeEventListener(this._updatePopupPosition);
  }
}