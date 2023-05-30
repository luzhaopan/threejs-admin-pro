<template>
  <div class="scene2" id="scene2"></div>
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

  // 3、创建物体外观：材质Material
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000 //0xff0000设置材质颜色为红色
  })

  // 4、创建物体网格模型Mesh，两个参数分别为几何体geometry、材质material
  const mesh: any = new THREE.Mesh(geometry, material)

  // 5、设置模型位置.position
  mesh.position.set(0, 10, 100)

  // 6、通过.add()方法把网格模型mesh添加到三维场景scene中
  scene.add(mesh)

  // 7、实例化一个透视投影相机对象（透视投影相机PerspectiveCamera）
  const camera: any = new THREE.PerspectiveCamera()

  // 8、相机位置.position
  camera.position.set(200, 200, 200)

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
  document.getElementById('scene2')!.appendChild(renderer.domElement)
}
</script>
