<template>
  <div>
    <div id="play">play</div>
    <div id="stop">stop</div>
    <div id="bu">暂停</div>
    <div class="scene18" id="scene18"></div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import TWEEN from '@tweenjs/tween.js'

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

  //几何体两组顶点一一对应，位置不同，然后通过权重系数，可以控制模型形状在两组顶点之间变化
  const geometry = new THREE.BoxGeometry(50, 50, 50)
  // 为geometry提供变形目标的顶点数据(注意和原始geometry顶点数量一致)
  const target1 = new THREE.BoxGeometry(50, 200, 50).attributes.position //变高
  const target2 = new THREE.BoxGeometry(10, 50, 10).attributes.position //变细
  // 几何体顶点变形目标数据，可以设置1组或多组
  geometry.morphAttributes.position = [target1, target2]

  const material: any = new THREE.MeshLambertMaterial({
    color: 0x00ffff
  })

  const mesh: any = new THREE.Mesh(geometry, material) //网格模型对象Mesh

  //创建一段mesh平移的动画
  const tween = new TWEEN.Tween(mesh.position)
  //经过2000毫秒，pos对象的x和y属性分别从零变化为100、50
  tween.to({ x: 100, y: 50 }, 2000)
  //tween动画开始执行
  tween.start()

  // 在XOZ平面上分布
  // mesh.position.set(50, 50, 50)
  scene.add(mesh) //网格模型添加到场景中

  const width = 800 //宽度
  const height = 500 //高度
  // 7、实例化一个透视投影相机对象（透视投影相机PerspectiveCamera）
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000)

  // 8、相机位置.position
  camera.position.set(200, 200, -200)
  camera.lookAt(0, 0, 0)

  camera.position.set(202, 123, 125)
  camera.lookAt(0, 0, 0)
  new TWEEN.Tween(camera.position)
    .to({ x: 202, y: 123, z: -350 }, 3000)
    // tweenjs改变参数对象的过程中，.onUpdate方法会被重复调用执行
    .onUpdate(function () {
      camera.lookAt(0, 0, 0)
    })
    .start()

  // 10、创建WebGL渲染器WebGLRenderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true // 扛锯齿
  })

  const controls = new OrbitControls(camera, renderer.domElement)
  // 相机控件.target属性在OrbitControls.js内部表示相机目标观察点，默认0,0,0
  // console.log('controls.target', controls.target);
  controls.target.set(0, 0, 0)

  // 11、设置Canvas画布尺寸.setSize()
  renderer.setSize(width, height) //设置three.js渲染区域的尺寸(像素px)
  //解决加载gltf格式模型纹理贴图和原图不一样问题
  renderer.outputEncoding = THREE.sRGBEncoding

  // 13、Canvas画布插入到任意HTML元素中
  document.getElementById('scene18')!.appendChild(renderer.domElement)

  function render() {
    TWEEN.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  render()
}
</script>
