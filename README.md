# 库存记录应用 (Inventory Tracker)

## 项目简介
这是一个使用 Expo 框架开发的 React Native 移动和网页端应用，用于管理和追踪库存。该应用支持通过相机扫描条形码来识别商品，并提供直观的库存管理界面。

## 主要功能

### 1. 库存列表展示
- 以列表/网格形式展示所有库存商品
- 支持按名称、数量、添加时间等多维度排序
- 支持搜索和筛选功能
- 展示商品详细信息（名称、图片、数量、条形码等）

### 2. 商品录入功能
- 支持手动输入商品信息
- 通过相机拍摄商品图片
- 扫描商品条形码自动识别
- 支持批量录入模式

### 3. 条形码识别系统
- 实时扫描条形码
- 支持多种条形码格式
- 自动关联商品信息
- 历史记录保存

## 技术架构

### 前端技术栈
- Expo Framework
- React Native
- React Navigation
- React Native Camera
- AsyncStorage 本地存储
- Expo Barcode Scanner

### 数据存储
- 本地存储：AsyncStorage
- 数据结构设计
  - 商品信息表
  - 库存记录表
  - 操作日志表

## 界面设计
- 遵循 Material Design 设计规范
- 支持深色/浅色主题
- 响应式布局适配不同设备

## 开发环境要求
- Node.js >= 14.0.0
- Expo CLI
- iOS 13.0+ / Android 6.0+
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
