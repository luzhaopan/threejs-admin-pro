<template>
  <div class="scene10" id="scene10"></div>
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

  //环境光:没有特定方向，整体改变场景的光照明暗
  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)

  // 批量创建多个长方体表示高层楼
  const group1: any = new THREE.Group() //所有高层楼的父对象
  group1.name = '高层'
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(20, 60, 10)
    const material: any = new THREE.MeshLambertMaterial({
      color: 0x00ffff
    })
    const mesh: any = new THREE.Mesh(geometry, material)
    mesh.position.x = i * 30 // 网格模型mesh沿着x轴方向阵列
    group1.add(mesh) //添加到组对象group1
    mesh.name = i + 1 + '号楼'
    // console.log('mesh.name',mesh.name);
  }
  group1.position.y = 30

  const group2: any = new THREE.Group()
  group2.name = '洋房'
  // 批量创建多个长方体表示洋房
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(20, 30, 10)
    const material: any = new THREE.MeshLambertMaterial({
      color: 0x00ffff
    })
    const mesh: any = new THREE.Mesh(geometry, material)
    mesh.position.x = i * 30
    group2.add(mesh) //添加到组对象group2
    mesh.name = i + 6 + '号楼'
    // 声明一个三维向量用来表示某个坐标
    // const worldPosition = new THREE.Vector3()
    // // 获取mesh的世界坐标，你会发现mesh的世界坐标受到父对象group的.position影响
    // mesh.getWorldPosition(worldPosition)
    // console.log('世界坐标', worldPosition)
    // console.log('本地坐标', mesh.position)
  }
  group2.position.z = 50
  group2.position.y = 15

  const model: any = new THREE.Group()
  model.name = '小区房子'
  model.add(group1, group2)
  model.position.set(-50, 0, -25)

  model.add(group1, group2)

  // setTimeout(() => {
  //   group2.visible = false
  // }, 2000)

  // 递归遍历model包含所有的模型节点
  model.traverse(function (obj) {
    console.log('所有模型节点的名称', obj.name)
    // obj.isMesh：if判断模型对象obj是不是网格模型'Mesh'
    if (obj.isMesh) {
      //判断条件也可以是obj.type === 'Mesh'
      obj.material.color.set(0xffff00)
    }
  })

  // console.log('group', group);
  // 在XOZ平面上分布
  scene.add(model) //网格模型添加到场景中

  // 查找某个具体的模型.getObjectByName()，返回名.name为"4号楼"对应的对象
  const nameNode = scene.getObjectByName('4号楼')
  nameNode.material.color.set(0xff0000)

  // a: 辅助观察坐标系
  // 坐标轴颜色红R、绿G、蓝B分别对应坐标系的x、y、z轴，对于three.js的3D坐标系默认y轴朝上。
  const axesHelper = new THREE.AxesHelper(150)
  scene.add(axesHelper)

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
    antialias: true // 扛锯齿
  })

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
  document.getElementById('scene10')!.appendChild(renderer.domElement)

  // function render() {
  //   renderer.render(scene, camera) //执行渲染操作
  //   requestAnimationFrame(render) //请求再次执行渲染函数render，渲染下一帧
  // }
  // render()
}
</script>
