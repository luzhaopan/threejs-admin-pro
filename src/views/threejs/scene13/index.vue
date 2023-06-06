<template>
  <div class="scene13" id="scene13"></div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { onMounted } from 'vue'

onMounted(() => {
  init()
})

const init = () => {
  // 1、创建3D场景对象Scene
  const scene = new THREE.Scene()

  //环境光:没有特定方向，整体改变场景的光照明暗
  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)

  // a: 辅助观察坐标系
  // 坐标轴颜色红R、绿G、蓝B分别对应坐标系的x、y、z轴，对于three.js的3D坐标系默认y轴朝上。
  const axesHelper = new THREE.AxesHelper(150)
  scene.add(axesHelper)

  const shape = new THREE.Shape()
  // .lineTo(100, 0)绘制直线线段，线段起点：.currentPoint，线段结束点：(100,0)
  shape.lineTo(100, 0)
  shape.lineTo(100, 100)
  shape.lineTo(0, 100)
  // Shape内孔轮廓
  const path1 = new THREE.Path() // 圆孔1
  path1.absarc(20, 20, 10)
  const path2 = new THREE.Path() // 圆孔2
  path2.absarc(80, 20, 10)
  const path3 = new THREE.Path() // 方形孔
  path3.moveTo(50, 50)
  path3.lineTo(80, 50)
  path3.lineTo(80, 80)
  path3.lineTo(50, 80)

  //三个内孔轮廓分别插入到holes属性中
  shape.holes.push(path1, path2, path3)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 20, //拉伸长度
    bevelEnabled: false, //禁止倒角
    curveSegments: 50
  })

  const material = new THREE.MeshLambertMaterial({
    color: '#0013e3'
  })

  const line = new THREE.Line(geometry, material)

  scene.add(line)

  const width = 800 //宽度
  const height = 500 //高度
  // 7、实例化一个透视投影相机对象（透视投影相机PerspectiveCamera）
  const camera: any = new THREE.PerspectiveCamera(30, width / height, 1, 3000)

  // 8、相机位置.position
  camera.position.set(200, 200, 200)

  // 10、创建WebGL渲染器WebGLRenderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true // 扛锯齿
  })

  // 11、设置Canvas画布尺寸.setSize()
  renderer.setSize(width, height) //设置three.js渲染区域的尺寸(像素px)
  //解决加载gltf格式模型纹理贴图和原图不一样问题
  renderer.outputEncoding = THREE.sRGBEncoding

  // 设置相机控件轨道控制器OrbitControls

  camera.lookAt(0, 0, 0)
  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  // 相机控件.target属性在OrbitControls.js内部表示相机目标观察点，默认0,0,0
  // console.log('controls.target', controls.target);
  controls.target.set(0, 0, 0)
  controls.update() //update()函数内会执行camera.lookAt(controls.targe)

  // // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  // controls.addEventListener('change', function () {
  //   renderer.render(scene, camera) //执行渲染操作
  // }) //监听鼠标、键盘事件

  // 设置了渲染循环,相机控件OrbitControls就不用再通过事件change执行renderer.render(scene, camera);，毕竟渲染循环一直在执行renderer.render(scene, camera);。

  // 13、Canvas画布插入到任意HTML元素中
  document.getElementById('scene13')!.appendChild(renderer.domElement)

  function render() {
    renderer.render(scene, camera) //执行渲染操作
    requestAnimationFrame(render) //请求再次执行渲染函数render，渲染下一帧
  }
  render()
}
</script>
