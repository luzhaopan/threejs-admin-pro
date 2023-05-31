<template>
  <div class="scene6" id="scene6"></div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { onMounted } from 'vue'

onMounted(() => {
  init()
})

const init = () => {
  // 1、创建3D场景对象Scene
  const scene = new THREE.Scene()

  // 2、创建物体形状
  const geometry = new THREE.BoxGeometry(50, 50, 50)

  // 漫反射网格材质MeshLambertMaterial
  const material: any = new THREE.MeshLambertMaterial({
    color: 0x00ffff, //设置材质颜色
    transparent: true, //开启透明
    opacity: 0.5 //设置透明度
  })

  //环境光:没有特定方向，整体改变场景的光照明暗
  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)

  // for循环创建物体网格模型Mesh，两个参数分别为几何体geometry、材质material
  // for (let i = 0; i < 10; i++) {
  //   const mesh: any = new THREE.Mesh(geometry, material) //网格模型对象Mesh
  //   // 沿着x轴分布
  //   mesh.position.set(i * 100, 50, 10)
  //   scene.add(mesh) //网格模型添加到场景中
  // }
  // 双层for循环创建阵列模型
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const mesh: any = new THREE.Mesh(geometry, material) //网格模型对象Mesh
      // 在XOZ平面上分布
      mesh.position.set(i * 100, 0, j * 200)
      scene.add(mesh) //网格模型添加到场景中
    }
  }

  // 3.2.2 平行光 DirectionalLight (opens new window)就是沿着特定方向发射。
  const directionalLight: any = new THREE.DirectionalLight(0xffffff, 1)
  // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(0, 50, 50)
  scene.add(directionalLight)

  // DirectionalLightHelper：可视化平行光, 通过点光源辅助观察对象DirectionalLightHelper (opens new window)可视化点光源。
  const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000)
  scene.add(dirLightHelper)

  // a: 辅助观察坐标系
  // 坐标轴颜色红R、绿G、蓝B分别对应坐标系的x、y、z轴，对于three.js的3D坐标系默认y轴朝上。
  const axesHelper = new THREE.AxesHelper(150)
  scene.add(axesHelper)

  const width = 800 //宽度
  const height = 500 //高度
  // 7、实例化一个透视投影相机对象（透视投影相机PerspectiveCamera）
  const camera: any = new THREE.PerspectiveCamera(30, width / height, 1, 8000)

  // 8、相机位置.position
  camera.position.set(2000, 2000, 2000)

  // 9、相机观察目标.lookAt()
  camera.lookAt(100, 0, 1000) //指向mesh对应的位置

  // 10、创建WebGL渲染器WebGLRenderer
  const renderer = new THREE.WebGLRenderer()

  // 11、设置Canvas画布尺寸.setSize()

  renderer.setSize(width, height) //设置three.js渲染区域的尺寸(像素px)

  // 12、渲染器WebGLRenderer执行渲染方法.render()就可以生成一个Canvas画布(照片)，并把三维场景Scene呈现在canvas画布上面,你可以把.render()理解为相机的拍照动作“咔”
  renderer.render(scene, camera)

  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  controls.addEventListener('change', function () {
    renderer.render(scene, camera) //执行渲染操作
  }) //监听鼠标、键盘事件

  // 设置了渲染循环,相机控件OrbitControls就不用再通过事件change执行renderer.render(scene, camera);，毕竟渲染循环一直在执行renderer.render(scene, camera);。

  // 13、Canvas画布插入到任意HTML元素中
  document.getElementById('scene6')!.appendChild(renderer.domElement)
}
</script>
