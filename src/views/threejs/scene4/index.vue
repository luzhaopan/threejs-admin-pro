<template>
  <div class="scene2" id="scene2"></div>
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
  const geometry = new THREE.BoxGeometry(100, 50, 80)

  // 3.2、 漫反射网格材质MeshLambertMaterial (opens new window)会受到光照影响，该材质也可以称为Lambert网格材质，音译为兰伯特网格材质。
  // 一个立方体长方体使用MeshLambertMaterial材质，不同面和光线夹角不同，立方体不同面就会呈现出来不同的明暗效果。
  //MeshLambertMaterial受光照影响
  const material: any = new THREE.MeshLambertMaterial({
    color: 0xff0000
  })
  // 3.2.1 添加光源
  // 点光源：两个参数分别表示光源颜色和光照强度
  // 参数1：0xffffff是纯白光,表示光源颜色
  // 参数2：1.0,表示光照强度，可以根据需要调整
  // const pointLight: any = new THREE.PointLight(0xffffff, 1.0)
  // // 光源位置
  // pointLight.position.set(300, 200, 200)
  // // 光源添加到场景
  // // 光源和网格模型Mesh对应一样是三维场景的一部分，自然需要添加到三维场景中才能起作用。
  // scene.add(pointLight) //点光源添加到场景中

  // 光源辅助观察, 可以借助相机控件OrbitControls旋转缩放三维场景便于预览点光源位置
  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 10)
  // scene.add(pointLightHelper)

  //环境光:没有特定方向，整体改变场景的光照明暗
  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)

  // 4、创建物体网格模型Mesh，两个参数分别为几何体geometry、材质material
  const mesh: any = new THREE.Mesh(geometry, material)

  // 5、设置模型位置.position
  mesh.position.set(0, 10, 100)

  // 3.2.2 平行光 DirectionalLight (opens new window)就是沿着特定方向发射。
  const directionalLight: any = new THREE.DirectionalLight(0xffffff, 1)
  // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(0, 50, 50)
  // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
  directionalLight.target = mesh
  scene.add(directionalLight)

  // DirectionalLightHelper：可视化平行光, 通过点光源辅助观察对象DirectionalLightHelper (opens new window)可视化点光源。
  const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000)
  scene.add(dirLightHelper)

  // 6、通过.add()方法把网格模型mesh添加到三维场景scene中
  scene.add(mesh)

  // a: 辅助观察坐标系
  // AxesHelper：辅助观察的坐标系
  // 坐标轴颜色红R、绿G、蓝B分别对应坐标系的x、y、z轴，对于three.js的3D坐标系默认y轴朝上。
  const axesHelper = new THREE.AxesHelper(150)
  scene.add(axesHelper)

  // 7、实例化一个透视投影相机对象（透视投影相机PerspectiveCamera）
  const camera: any = new THREE.PerspectiveCamera()

  // 8、相机位置.position
  camera.position.set(300, 300, 300)

  // 9、相机观察目标.lookAt()
  camera.lookAt(mesh.position) //指向mesh对应的位置

  // 10、创建WebGL渲染器WebGLRenderer
  const renderer = new THREE.WebGLRenderer()

  // 11、设置Canvas画布尺寸.setSize()
  const width = 800 //宽度
  const height = 500 //高度
  renderer.setSize(width, height) //设置three.js渲染区域的尺寸(像素px)

  // 12、渲染器WebGLRenderer执行渲染方法.render()就可以生成一个Canvas画布(照片)，并把三维场景Scene呈现在canvas画布上面,你可以把.render()理解为相机的拍照动作“咔”
  renderer.render(scene, camera)

  // 使用OrbitControls
  // 旋转：拖动鼠标左键
  // 缩放：滚动鼠标中键
  // 平移：拖动鼠标右键
  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  controls.addEventListener('change', function () {
    renderer.render(scene, camera) //执行渲染操作
  }) //监听鼠标、键盘事件

  // 13、Canvas画布插入到任意HTML元素中
  document.getElementById('scene2')!.appendChild(renderer.domElement)
}
</script>
