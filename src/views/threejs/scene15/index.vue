<template>
  <div class="scene15" id="scene15"></div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 从threejs扩展库引入gui.js
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

import { onMounted } from 'vue'

onMounted(() => {
  init()
})

const init = () => {
  const gui = new GUI() //创建GUI对象
  gui.domElement.style.right = '0px'
  gui.domElement.style.width = '300px'

  // 1、创建3D场景对象Scene
  const scene = new THREE.Scene()

  //环境光:没有特定方向，整体改变场景的光照明暗
  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)

  // gui.add(ambient, 'intensity', 0, 2).name('环境光.intensity')
  // const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  // directionalLight.position.set(100, 60, 50)
  // scene.add(directionalLight)

  // a: 辅助观察坐标系
  // 坐标轴颜色红R、绿G、蓝B分别对应坐标系的x、y、z轴，对于three.js的3D坐标系默认y轴朝上。
  const axesHelper = new THREE.AxesHelper(150)
  scene.add(axesHelper)

  // // 创建GLTF加载器对象
  // const loader = new GLTFLoader()
  // const textureCube = new THREE.CubeTextureLoader()
  //   .setPath('../../../../public/imgs/')
  //   .load(['gucci.jpg', 'bag.png', 'macpro.jpg', 'shoes.png', 'gucci.jpg', 'gucci.jpg'])
  // textureCube.encoding = THREE.sRGBEncoding
  // loader.load('../../../../public/files/gltf/bag2.glb', function (gltf) {
  //   gltf.scene.children[3].children[0].intensity = 1
  //   scene.add(gltf.scene)
  //   gltf.scene.traverse(function (obj) {
  //     if (obj.isMesh) {
  //       //判断是否是网格模型
  //       obj.material.envMap = textureCube //设置环境贴图
  //       obj.material.envMapIntensity = 1.0
  //     }
  //   })
  //   const obj = {
  //     envMapIntensity: 1.0
  //   }
  //   gui.add(obj, 'envMapIntensity', 0, 2).onChange(function (value) {
  //     // 递归遍历，批量设置模型材质的`.envMapIntensity`属性
  //     gltf.scene.traverse(function (obj) {
  //       if (obj.isMesh) {
  //         obj.material.envMapIntensity = value
  //       }
  //     })
  //   })
  // })

  const texture = new THREE.TextureLoader().load('../../../../public/imgs/macpro.jpg')
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture //设置精灵纹理贴图
  })

  // 创建精灵模型对象，不需要几何体geometry参数
  // const sprite = new THREE.Sprite(spriteMaterial)
  // scene.add(sprite)
  const group = new THREE.Group()
  for (let i = 0; i < 16000; i++) {
    // 精灵模型共享材质
    const sprite = new THREE.Sprite(spriteMaterial)
    group.add(sprite)
    sprite.scale.set(1, 1, 1)
    // 设置精灵模型位置，在长方体空间上上随机分布
    const x = 1000 * (Math.random() - 0.5)
    const y = 600 * Math.random()
    const z = 1000 * (Math.random() - 0.5)
    sprite.position.set(x, y, z)
  }
  scene.add(group)
  const width = 800 //宽度
  const height = 500 //高度
  // 7、实例化一个透视投影相机对象（透视投影相机PerspectiveCamera）
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000)

  // 8、相机位置.position
  camera.position.set(100, 100, -100)
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
  document.getElementById('scene15')!.appendChild(renderer.domElement)

  function render() {
    group.children.forEach((sprite) => {
      // 雨滴的y坐标每次减1
      sprite.position.y -= 1
      if (sprite.position.y < 0) {
        // 如果雨滴落到地面，重置y，从新下落
        sprite.position.y = 600
      }
    })
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  render()
}
</script>
