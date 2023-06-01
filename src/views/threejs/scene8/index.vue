<template>
  <div class="scene8" id="scene8"></div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 引入dat.gui.js的一个类GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

import { onMounted } from 'vue'

onMounted(() => {
  init()
})

const init = () => {
  // 实例化一个gui对象, 创建一个GUI对象，你可以看到浏览器右上角多了一个交互界面，GUI本质上就是一个前端js库。
  const gui = new GUI()

  //改变交互界面style属性
  gui.domElement.style.right = '0px'
  gui.domElement.style.width = '300px'

  // 1、创建3D场景对象Scene
  const scene = new THREE.Scene()

  // 2、创建物体形状
  // 创建一个空的几何体对象
  const geometry = new THREE.BufferGeometry(); 

  // BufferAttribute定义几何体顶点数据
// 通过javascript类型化数组 (opens new window)Float32Array创建一组xyz坐标数据用来表示几何体的顶点坐标。

// 类型化数组创建顶点数据
const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    50, 0, 0, //顶点2坐标
    0, 100, 0, //顶点3坐标
    0, 0, 10, //顶点4坐标
    0, 0, 100, //顶点5坐标
    50, 0, 10, //顶点6坐标
]);

// 通过threejs的属性缓冲区对象BufferAttribute (opens new window)表示threejs几何体顶点数据。

// 创建属性缓冲区对象
//3个为一组，表示一个顶点的xyz坐标
const attribue = new THREE.BufferAttribute(vertices, 3); 

// 设置几何体顶点.attributes.position
// 通过geometry.attributes.position设置几何体顶点位置属性的值BufferAttribute。

// 设置几何体attributes属性的位置属性
geometry.attributes.position = attribue;


  //环境光:没有特定方向，整体改变场景的光照明暗
  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)

  // 模拟镜面反射，产生一个高光效果
  const material: any = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 20, //高光部分的亮度，默认30
    specular: 0x444444 //高光部分的颜色
  })

  const mesh: any = new THREE.Mesh(geometry, material) //网格模型对象Mesh

  // 点渲染模式
  const material1 = new THREE.PointsMaterial({
      color: 0xffff00,
      size: 10.0 //点对象像素尺寸
  }); 
  const points = new THREE.Points(geometry, material1); //点模型对象

  // 线材质对象
  const material2 = new THREE.LineBasicMaterial({
      color: 0xff0000 //线条颜色
  }); 
  // 创建线模型对象
  // const line = new THREE.Line(geometry, material2);

  // 闭合线条
  // const line = new THREE.LineLoop(geometry, material2); 

  //非连续的线条
  const line = new THREE.LineSegments(geometry, material2);



  // 在XOZ平面上分布
  // mesh.position.set(50, 50, 50)
  scene.add(mesh) //网格模型添加到场景中

  scene.add(points) 

  scene.add(line)

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

  renderer.setClearColor(0x444444, 1) //设置背景颜色

  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  controls.addEventListener('change', function () {
    renderer.render(scene, camera) //执行渲染操作
  }) //监听鼠标、键盘事件

  // 设置了渲染循环,相机控件OrbitControls就不用再通过事件change执行renderer.render(scene, camera);，毕竟渲染循环一直在执行renderer.render(scene, camera);。

  // 13、Canvas画布插入到任意HTML元素中
  document.getElementById('scene8')!.appendChild(renderer.domElement)

  // function render() {
  //   renderer.render(scene, camera) //执行渲染操作
  //   requestAnimationFrame(render) //请求再次执行渲染函数render，渲染下一帧
  // }
  // render()
}
</script>
