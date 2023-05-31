<template>
  <div class="scene3" id="scene3"></div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted } from 'vue'

onMounted(() => {
  init()
})

const init = () => {
  // 1、创建3D场景对象Scene
  const scene = new THREE.Scene()

  // 2、创建物体形状
  const geometry = new THREE.BoxGeometry(100, 50, 80)

  // 3.1、创建物体外观：材质Material, 基础网格材质MeshBasicMaterial (opens new window)不会受到光照影响。
  // const material = new THREE.MeshBasicMaterial({
  //   color: 0xff0000, //0xff0000设置材质颜色为红色
  //   transparent: true, //开启透明
  //   opacity: 0.5 //设置透明度
  // })

  // 3.2、 漫反射网格材质MeshLambertMaterial (opens new window)会受到光照影响，该材质也可以称为Lambert网格材质，音译为兰伯特网格材质。
  // 一个立方体长方体使用MeshLambertMaterial材质，不同面和光线夹角不同，立方体不同面就会呈现出来不同的明暗效果。
  //MeshLambertMaterial受光照影响
  const material = new THREE.MeshLambertMaterial({
    color: 0xff0000
  })

  // 点光源PointLight (opens new window)可以类比为一个发光点，就像生活中一个灯泡以灯泡为中心向四周发射光线。

  //点光源：两个参数分别表示光源颜色和光照强度
  // 参数1：0xffffff是纯白光,表示光源颜色
  // 参数2：1.0,表示光照强度，可以根据需要调整
  const pointLight = new THREE.PointLight(0xffffff, 1.0)

  // 光源位置
  // 你把点光源想象为一个电灯泡，你在3D空间中，放的位置不同，模型的渲染效果就不一样。
  // 注意光源位置尺寸大小：如果你希望光源照在模型的外表面，那你就需要把光源放在模型的外面。
  //点光源位置
  pointLight.position.set(400, 200, 200)

  // 光源添加到场景
  // 光源和网格模型Mesh对应一样是三维场景的一部分，自然需要添加到三维场景中才能起作用。
  scene.add(pointLight) //点光源添加到场景中

  // 4、创建物体网格模型Mesh，两个参数分别为几何体geometry、材质material
  const mesh: any = new THREE.Mesh(geometry, material)

  // 5、设置模型位置.position
  mesh.position.set(0, 10, 100)

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

  // eg: 相机放在x轴负半轴，目标观察点是坐标原点，这样相当于相机的视线是沿着x轴正方向，只能看到长方体的一个矩形平面。
  // camera.position.set(-1000, 0, 0)
  // camera.lookAt(0, 0, 0)

  // eg: 相机视线沿着x轴负半轴，mesh位于相机后面，自然看不到
  // camera.position.set(-1000, 0, 0)
  // camera.lookAt(-2000, 0, 0)

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

  // 渲染器Canvas画布属性.domElement
  // 渲染器WebGLRenderer通过属性.domElement可以获得渲染方法.render()生成的Canvas画布，.domElement本质上就是一个HTML元素：Canvas画布。
  // document.body.appendChild(renderer.domElement)

  // 13、Canvas画布插入到任意HTML元素中
  document.getElementById('scene3')!.appendChild(renderer.domElement)
}
</script>
