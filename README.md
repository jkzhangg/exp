# 库存记录应用 (Inventory Tracker)

## 项目简介
这是一个使用 Expo 框架开发的 React Native 移动和网页端通用应用，用于管理和追踪库存。该应用支持通过相机扫描条形码来识别商品，并提供直观的库存管理界面。

## 主要功能

### 1. 库存列表展示
- 列表项展示内容：
  - 商品条形码图片
  - 录入时间
  - 商品 ID
  - 商品名称（如果存在）
  - 商品图片（如果存在）
  - 商品数量控制
    - 默认值：0
    - 可手动调节增减
    - 调节步长：1
    - 数值范围：0-99

### 2. 商品录入功能
- 相机扫描功能：
  - 进入页面自动激活摄像头
  - 实时预览和信息回显
  - 条形码识别成功后自动关闭摄像头
  - 识别失败支持重新扫描
- 数据录入界面（上下布局）：
  - 摄像头回显区域
  - 扫描按钮
  - 商品编码输入框（支持手动修改）
  - 入库按钮
- 录入数据项：
  - 商品 ID
  - 录入时间
  - 商品照片（如有）

## 技术架构

### 前端技术栈
- Expo Framework
- React Native
- React Navigation
- React Native Camera
- AsyncStorage 本地存储
- Expo Barcode Scanner
- ZXing (Web 端条码扫描)

### 数据存储
- 本地存储：AsyncStorage
- 数据结构设计
  - 商品信息表
  - 库存记录表
  - 操作日志表

## 界面设计
- 统一的设计主题
- 响应式布局适配 Web/移动端
- 优化的扫描交互体验

## 开发环境要求
- Node.js >= 14.0.0
- Expo CLI
- iOS 13.0+ / Android 6.0+
- 现代浏览器（支持 MediaDevices API）
- Yarn 或 npm

## 安装和运行
```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn start

# 运行 iOS 模拟器
yarn ios

# 运行 Android 模拟器
yarn android

# 运行 Web 版本
yarn web
```

## 项目结构
```
src/
├── components/     # 可复用组件
├── screens/       # 页面组件
├── navigation/    # 导航配置
├── services/      # 业务逻辑服务
├── utils/         # 工具函数
├── hooks/         # 自定义 Hooks
├── constants/     # 常量定义
├── types/         # TypeScript 类型定义
└── assets/        # 静态资源
```

## 开发规范
- 遵循 ESLint 和 Prettier 配置
- 使用 TypeScript 进行类型检查
- 遵循组件化和模块化开发原则
- 编写单元测试和集成测试

## 版本规划
详见 [DEV_PLAN.md](./DEV_PLAN.md)

## 贡献指南
1. Fork 本仓库
2. 创建特性分支
3. 提交变更
4. 发起 Pull Request

## 许可证
MIT License
