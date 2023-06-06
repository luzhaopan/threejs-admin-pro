<template>
  <div>
    <div id="play">play</div>
    <div id="stop">stop</div>
    <div id="bu">暂停</div>
    <div class="scene17" id="scene17"></div>
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

  //权重0：物体形状对应geometry.attributes.position表示形状
  mesh.morphTargetInfluences[0] = 0.0
  //权重1：物体形状对应target1表示形状
  mesh.morphTargetInfluences[0] = 1.0
  //权重0.5：物体形状对应geometry和target1变形中间状态
  mesh.morphTargetInfluences[0] = 0.5

  mesh.morphTargetInfluences[1] = 0.5

  // 创建变形动画权重系数的关键帧数据
  mesh.name = 'Box' //关键帧动画控制的模型对象命名
  // 设置变形目标1对应权重随着时间的变化
  const KF1 = new THREE.KeyframeTrack('Box.morphTargetInfluences[0]', [0, 5], [0, 1])
  // 设置变形目标2对应权重随着时间的变化
  const KF2 = new THREE.KeyframeTrack('Box.morphTargetInfluences[1]', [5, 10], [0, 1])
  // 创建一个剪辑clip对象
  const clip = new THREE.AnimationClip('t', 10, [KF1, KF2])
  const mixer = new THREE.AnimationMixer(mesh)
  const clipAction = mixer.clipAction(clip)
  clipAction.play()
  clipAction.loop = THREE.LoopOnce //不循环播放
  clipAction.clampWhenFinished = true // 物体状态停留在动画结束的时候

  // 在XOZ平面上分布
  // mesh.position.set(50, 50, 50)
  scene.add(mesh) //网格模型添加到场景中

  const Bone1 = new THREE.Bone() //关节1，用来作为根关节
  const Bone2 = new THREE.Bone() //关节2
  const Bone3 = new THREE.Bone() //关节3
  // 设置关节父子关系   多个骨头关节构成一个树结构
  Bone1.add(Bone2)
  Bone2.add(Bone3)
  //根关节Bone1默认位置是(0,0,0)
  Bone2.position.y = 60 //Bone2相对父对象Bone1位置
  Bone3.position.y = 30 //Bone3相对父对象Bone2位置
  //平移Bone1，Bone2、Bone3跟着平移
  Bone1.position.set(50, 0, 50)
  // 骨骼关节旋转
  Bone1.rotateX(Math.PI / 6)
  Bone2.rotateX(Math.PI / 6)
  // 骨骼关节可以和普通网格模型一样作为其他模型子对象，添加到场景中
  const group = new THREE.Group()
  group.add(Bone1)
  // SkeletonHelper会可视化参数模型对象所包含的所有骨骼关节
  const skeletonHelper = new THREE.SkeletonHelper(group)
  group.add(skeletonHelper)
  scene.add(group)

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
  document.getElementById('scene17')!.appendChild(renderer.domElement)

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
