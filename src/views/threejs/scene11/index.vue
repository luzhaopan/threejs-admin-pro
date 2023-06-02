<template>
  <div class="scene11" id="scene11"></div>
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

  const geometry1 = new THREE.PlaneGeometry(200, 100)
  //纹理贴图加载器TextureLoader
  const texLoader = new THREE.TextureLoader()
  // .load()方法加载图像，返回一个纹理对象Texture
  const texture = texLoader.load('../../../../public/imgs/gucci.jpg')
  const material: any = new THREE.MeshLambertMaterial({
    // 设置纹理贴图：Texture对象作为材质map属性的属性值
    map: texture //map表示材质的颜色贴图属性
  })

  const geometry2 = new THREE.SphereGeometry(60, 25, 25) //球体

  // material.map = texture;

  const mesh1: any = new THREE.Mesh(geometry1, material) //网格模型对象Mesh

  const mesh2: any = new THREE.Mesh(geometry2, material) //网格模型对象Mesh
  mesh2.position.set(0, 10, 100)

  //CircleGeometry的顶点UV坐标是按照圆形采样纹理贴图
  const geometry3 = new THREE.CircleGeometry(60, 100)
  //纹理贴图加载器TextureLoader
  const material3 = new THREE.MeshBasicMaterial({
    map: texture, //map表示材质的颜色贴图属性
    side: THREE.DoubleSide
  })
  const mesh3: any = new THREE.Mesh(geometry3, material3)
  mesh3.position.set(0, 10, 50)

  const geometry4 = new THREE.PlaneGeometry(2000, 2000)
  //纹理贴图加载器TextureLoader
  const texLoader4 = new THREE.TextureLoader()
  // .load()方法加载图像，返回一个纹理对象Texture
  const texture4 = texLoader4.load('../../../../public/imgs/macpro.jpg')
  // 设置阵列模式
  texture4.wrapS = THREE.RepeatWrapping
  texture4.wrapT = THREE.RepeatWrapping
  // uv两个方向纹理重复数量
  texture4.repeat.set(12, 12) //注意选择合适的阵列数量

  texture4.offset.x += 0.5 //纹理U方向偏移
  // 设置.wrapS也就是U方向，纹理映射模式(包裹模式)
  texture4.wrapS = THREE.RepeatWrapping //对应offste.x偏移

  const material4: any = new THREE.MeshLambertMaterial({
    // 设置纹理贴图：Texture对象作为材质map属性的属性值
    map: texture4 //map表示材质的颜色贴图属性
  })
  const mesh4 = new THREE.Mesh(geometry4, material4)
  // 旋转矩形平面
  mesh4.rotateX(-Math.PI / 2)

  // console.log('group', group);
  // 在XOZ平面上分布
  scene.add(mesh1, mesh2, mesh3, mesh4) //网格模型添加到场景中

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
  // renderer.render(scene, camera)

  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  // // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  // controls.addEventListener('change', function () {
  //   renderer.render(scene, camera) //执行渲染操作
  // }) //监听鼠标、键盘事件

  // 设置了渲染循环,相机控件OrbitControls就不用再通过事件change执行renderer.render(scene, camera);，毕竟渲染循环一直在执行renderer.render(scene, camera);。

  // 13、Canvas画布插入到任意HTML元素中
  document.getElementById('scene11')!.appendChild(renderer.domElement)

  function render() {
    texture4.offset.x += 0.001 //设置纹理动画：偏移量根据纹理和动画需要，设置合适的值
    renderer.render(scene, camera) //执行渲染操作
    requestAnimationFrame(render) //请求再次执行渲染函数render，渲染下一帧
  }
  render()
}
</script>
