<template>
  <div class="scene1" id="scene1"></div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted } from 'vue'

onMounted(() => {
  // 1、创建3D场景对象Scene
  const scene = new THREE.Scene()
  // console.log(scene)

  // 2、物体形状：几何体Geometry
  //创建一个长方体几何对象Geometry
  const geometry = new THREE.BoxGeometry(50, 50, 80)
  // console.log(geometry)

  // 物体外观：材质Material
  // 如果你想定义物体的外观效果，比如颜色，就需要通过材质Material相关的API实现。
  //创建一个材质对象Material
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000 //0xff0000设置材质颜色为红色
  })
  // console.log(material)

  //3、物体：网格模型Mesh
  //实际生活中有各种各样的物体，在threejs中可以通过网格模型Mesh (opens new window)表示一个虚拟的物体，比如一个箱子、一个鼠标。
  // 两个参数分别为几何体geometry、材质material
  const mesh: any = new THREE.Mesh(geometry, material) //网格模型对象Mesh
  // console.log(mesh)

  //模型位置.position
  //实际生活中，一个物体往往是有位置的，对于threejs而言也是一样的，你可以通过位置属性.position定义网格模型Mesh在三维场景Scene中的位置。
  //设置网格模型在三维空间中的位置坐标，默认是坐标原点
  mesh.position.set(0, 10, 100)

  //.add()方法
  //在threejs中你创建了一个表示物体的虚拟对象Mesh，需要通过.add()方法，把网格模型mesh添加到三维场景scene中。
  scene.add(mesh)

  //4、透视投影相机PerspectiveCamera
  //Threejs提供了正投影相机OrthographicCamera (opens new window)和透视投影相机PerspectiveCamera (opens new window)。本节课先给大家比较常用的透视投影相机PerspectiveCamera。
  //透视投影相机PerspectiveCamera本质上就是在模拟人眼观察这个世界的规律。
  // 实例化一个透视投影相机对象
  const camera: any = new THREE.PerspectiveCamera()
  // console.log(camera)

  //相机位置.position
  //生活中用相机拍照，你相机位置不同，拍照结果也不同，threejs中虚拟相机同样如此。
  //比如有一间房子，你拿着相机站在房间里面，看到的是房间内部，站在房子外面看到的是房子外面效果。
  //相机对象Camera具有位置属性.position，通过位置属性.position可以设置相机的位置。
  //相机在Three.js三维坐标系中的位置
  // 根据需要设置相机位置具体值
  camera.position.set(100, 300, 100)

  //相机观察目标.lookAt()
  //你用相机拍照你需要控制相机的拍照目标，具体说相机镜头对准哪个物体或说哪个坐标。对于threejs相机而言，就是设置.lookAt()方法的参数，指定一个3D坐标。

  //相机观察目标指向Threejs 3D空间中某个位置
  // camera.lookAt(0, 0, 0) //坐标原点
  // camera.lookAt(0, 10, 0) //y轴上位置10
  camera.lookAt(mesh.position) //指向mesh对应的位置

  // 透视投影相机PerspectiveCamera：视锥体
  // 透视投影相机的四个参数fov, aspect, near, far构成一个四棱台3D空间，被称为视锥体，只有视锥体之内的物体，才会渲染出来，视锥体范围之外的物体不会显示在Canvas画布上。
  // width和height用来设置Three.js输出的Canvas画布尺寸(像素px)
  const width = 800 //宽度
  const height = 500 //高度
  // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
  // const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);

  // 5 WebGL渲染器WebGLRenderer
  // 通过WebGL渲染器WebGLRenderer (opens new window)可以实例化一个WebGL渲染器对象。
  // 创建渲染器对象
  const renderer = new THREE.WebGLRenderer()

  // 设置Canvas画布尺寸.setSize()
  // 定义threejs输出画布的尺寸(单位:像素px)
  // const width = 800 //宽度
  // const height = 500 //高度
  renderer.setSize(width, height) //设置three.js渲染区域的尺寸(像素px)

  // 渲染器渲染方法.render()
  // 渲染器WebGLRenderer执行渲染方法.render()就可以生成一个Canvas画布(照片)，并把三维场景Scene呈现在canvas画布上面,你可以把.render()理解为相机的拍照动作“咔”。

  renderer.render(scene, camera) //执行渲染操作

  // 渲染器Canvas画布属性.domElement
  // 渲染器WebGLRenderer通过属性.domElement可以获得渲染方法.render()生成的Canvas画布，.domElement本质上就是一个HTML元素：Canvas画布。

  // document.body.appendChild(renderer.domElement)

  //Canvas画布插入到任意HTML元素中
  document.getElementById('scene1')!.appendChild(renderer.domElement)
})
</script>
