<template>
  <div>
    <div id="play">play</div>
    <div id="stop">stop</div>
    <div id="bu">暂停</div>
    <div class="scene16" id="scene16"></div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// 引入CSS2模型对象CSS2DObject
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
// 引入CSS2渲染器CSS2DRenderer
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'

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

  const geometry = new THREE.SphereGeometry(50, 32, 16)
  const material: any = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    wireframe: true //线条模式渲染mesh对应的三角形数据
  })

  const mesh: any = new THREE.Mesh(geometry, material) //网格模型对象Mesh

  // 给需要设置关键帧动画的模型命名
  mesh.name = 'Box'
  const times = [0, 3, 6] //时间轴上，设置三个时刻0、3、6秒
  // times中三个不同时间点，物体分别对应values中的三个xyz坐标
  const values = [0, 0, 0, 100, 0, 0, 0, 0, 100]
  // 0~3秒，物体从(0,0,0)逐渐移动到(100,0,0),3~6秒逐渐从(100,0,0)移动到(0,0,100)
  const posKF = new THREE.KeyframeTrack('Box.position', times, values)
  // 从2秒到5秒，物体从红色逐渐变化为蓝色
  const colorKF = new THREE.KeyframeTrack('Box.material.color', [2, 5], [1, 0, 0, 0, 0, 1])
  // 1.3 基于关键帧数据，创建一个clip关键帧动画对象，命名"test"，持续时间6秒。
  const clip = new THREE.AnimationClip('test', 9, [posKF, colorKF])

  //包含关键帧动画的模型对象作为AnimationMixer的参数创建一个播放器mixer
  const mixer = new THREE.AnimationMixer(mesh)

  //AnimationMixer的`.clipAction()`返回一个AnimationAction对象
  const clipAction = mixer.clipAction(clip)
  //.play()控制动画播放，默认循环播放
  // clipAction.play()

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
  document.getElementById('scene16')!.appendChild(renderer.domElement)

  document.getElementById('stop').addEventListener('click', function () {
    clipAction.stop() //动画停止结束，回到开始状态
  })
  document.getElementById('play').addEventListener('click', function () {
    clipAction.play() //播放动画
  })

  const bu = document.getElementById('bu')
  bu.addEventListener('click', function () {
    // AnimationAction.paused默认值false，设置为true，可以临时暂停动画
    if (clipAction.paused) {
      //暂停状态
      clipAction.paused = false //切换为播放状态
      bu.innerHTML = '暂停' // 如果改变为播放状态，按钮文字设置为“暂停”
    } else {
      //播放状态
      clipAction.paused = true //切换为暂停状态
      bu.innerHTML = '继续' // 如果改变为暂停状态，按钮文字设置为“继续”
    }
  })

  const clock = new THREE.Clock()
  function render() {
    renderer.render(scene, camera)
    requestAnimationFrame(render)
    const frameT = clock.getDelta()
    // 更新播放器相关的时间
    mixer.update(frameT)
  }
  render()
}
</script>
