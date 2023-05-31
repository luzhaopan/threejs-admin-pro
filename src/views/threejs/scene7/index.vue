<template>
  <div class="scene7" id="scene7"></div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 引入dat.gui.js的一个类GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

import { onMounted } from 'vue'

onMounted(() => {
  init()
})

const init = () => {
  // 实例化一个gui对象, 创建一个GUI对象，你可以看到浏览器右上角多了一个交互界面，GUI本质上就是一个前端js库。
  const gui = new GUI()

  //改变交互界面style属性
  gui.domElement.style.right = '0px'
  gui.domElement.style.width = '300px'

  //创建一个对象，对象属性的值可以被GUI库创建的交互界面改变
  // const obj = {
  //   x: 30,
  //   y: 60,
  //   z: 30
  // }
  // // gui界面上增加交互界面，改变obj对应属性
  // gui.add(obj, 'x', 0, 100)
  // gui.add(obj, 'y', 0, 50)
  // gui.add(obj, 'z', 0, 60)

  // 1、创建3D场景对象Scene
  const scene = new THREE.Scene()

  // 2、创建物体形状
  const geometry = new THREE.BoxGeometry(50, 50, 50)

  //环境光:没有特定方向，整体改变场景的光照明暗
  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)

  // 模拟镜面反射，产生一个高光效果
  const material: any = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 20, //高光部分的亮度，默认30
    specular: 0x444444 //高光部分的颜色
  })

  const mesh: any = new THREE.Mesh(geometry, material) //网格模型对象Mesh

  gui.add(mesh.position, 'x', 0, 180)
  gui.add(mesh.position, 'y', 0, 180)
  gui.add(mesh.position, 'z', 0, 180)

  // 在XOZ平面上分布
  // mesh.position.set(50, 50, 50)
  scene.add(mesh) //网格模型添加到场景中

  // 3.2.2 平行光 DirectionalLight (opens new window)就是沿着特定方向发射。
  const directionalLight: any = new THREE.DirectionalLight(0xffffff, 1)
  // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(100, 100, 100)
  scene.add(directionalLight)

  // DirectionalLightHelper：可视化平行光, 通过点光源辅助观察对象DirectionalLightHelper (opens new window)可视化点光源。
  const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000)
  scene.add(dirLightHelper)

  // a: 辅助观察坐标系
  // 坐标轴颜色红R、绿G、蓝B分别对应坐标系的x、y、z轴，对于three.js的3D坐标系默认y轴朝上。
  const axesHelper = new THREE.AxesHelper(150)
  scene.add(axesHelper)

  // gui.add(ambient, 'intensity', 0, 2.0).name('环境光强度')
  gui.add(directionalLight, 'intensity', 0, 2.0).name('平行光强度')
  gui.add(ambient, 'intensity', 0, 2.0).name('环境光强度').step(0.1)

  const obj = {
    x: 30
  }
  // 当obj的x属性变化的时候，就把此时obj.x的值value赋值给mesh的x坐标
  gui.add(obj, 'x', 0, 180).onChange(function (value) {
    mesh.position.x = value
    // 你可以写任何你想跟着obj.x同步变化的代码
    // 比如mesh.position.y = value;
  })

  const obj1 = {
    color: 0x00ffff
  }
  // .addColor()生成颜色值改变的交互界面
  gui.addColor(obj1, 'color').onChange(function (value) {
    mesh.material.color.set(value)
  })

  // 参数3是一个数组，生成交互界面是下拉菜单
  const obj2 = {
    scale: 0
  }
  // 参数3数据类型：数组(下拉菜单)
  gui
    .add(obj2, 'scale', [-100, 0, 100])
    .name('y坐标')
    .onChange(function (value) {
      mesh.position.y = value
    })

  const obj3 = {
    scale: 0
  }
  // 参数3数据类型：对象(下拉菜单)
  gui
    .add(obj3, 'scale', {
      left: -100,
      center: 0,
      right: 100
      // 左: -100,//可以用中文
      // 中: 0,
      // 右: 100
    })
    .name('位置选择')
    .onChange(function (value) {
      mesh.position.x = value
    })

  const obj4 = {
    bool: false
  }
  // 改变的obj属性数据类型是布尔值，交互界面是单选框
  gui
    .add(obj4, 'bool')
    .name('是否旋转')
    .onChange(function (value) {
      // 点击单选框，控制台打印obj.bool变化
      console.log('obj.bool', value)
    })

  // 通过gui对象的.addFolder()方法可以创建一个子菜单，当你通过GUI控制的属性比较多的时候，可以使用.addFolder()进行分组。
  // .addFolder()返回的子文件夹对象，同样具有gui对象的.add()、.onChange()、.addColor()等等属性。
  const obj5 = {
    color: 0x00ffff // 材质颜色
  }
  // 创建材质子菜单
  const matFolder = gui.addFolder('材质')
  matFolder.close()
  // 材质颜色color
  matFolder.addColor(obj5, 'color').onChange(function (value) {
    material.color.set(value)
  })

  // 环境光子菜单
  const ambientFolder = gui.addFolder('环境光')
  // 环境光强度
  ambientFolder.add(ambient, 'intensity', 0, 2)

  const width = 800 //宽度
  const height = 500 //高度
  // 7、实例化一个透视投影相机对象（透视投影相机PerspectiveCamera）
  const camera: any = new THREE.PerspectiveCamera(30, width / height, 1, 8000)

  // 8、相机位置.position
  camera.position.set(200, 200, 200)

  // 9、相机观察目标.lookAt()
  camera.lookAt(10, 10, 20) //指向mesh对应的位置

  // 10、创建WebGL渲染器WebGLRenderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })

  // 11、设置Canvas画布尺寸.setSize()

  renderer.setSize(width, height) //设置three.js渲染区域的尺寸(像素px)

  // 12、渲染器WebGLRenderer执行渲染方法.render()就可以生成一个Canvas画布(照片)，并把三维场景Scene呈现在canvas画布上面,你可以把.render()理解为相机的拍照动作“咔”
  // renderer.render(scene, camera)

  renderer.setClearColor(0x444444, 1) //设置背景颜色

  // 设置相机控件轨道控制器OrbitControls
  // const controls = new OrbitControls(camera, renderer.domElement)
  // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  // controls.addEventListener('change', function () {
  //   renderer.render(scene, camera) //执行渲染操作
  // }) //监听鼠标、键盘事件

  // 设置了渲染循环,相机控件OrbitControls就不用再通过事件change执行renderer.render(scene, camera);，毕竟渲染循环一直在执行renderer.render(scene, camera);。

  // 13、Canvas画布插入到任意HTML元素中
  document.getElementById('scene7')!.appendChild(renderer.domElement)

  function render() {
    // 当gui界面设置obj.bool为true,mesh执行旋转动画
    if (obj4.bool) mesh.rotateY(0.01)
    renderer.render(scene, camera) //执行渲染操作
    requestAnimationFrame(render) //请求再次执行渲染函数render，渲染下一帧
  }
  render()
}
</script>
