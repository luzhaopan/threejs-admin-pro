<template>
  <div class="scene12" id="scene12"></div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { onMounted } from 'vue'

onMounted(() => {
  init()
})

const init = () => {
  // 1、创建3D场景对象Scene
  const scene = new THREE.Scene()

  //环境光:没有特定方向，整体改变场景的光照明暗
  // const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  // scene.add(ambient)

  // const pointLight: any = new THREE.PointLight(0xffffff, 0.5)

  // 光源位置
  // 你把点光源想象为一个电灯泡，你在3D空间中，放的位置不同，模型的渲染效果就不一样。
  // 注意光源位置尺寸大小：如果你希望光源照在模型的外表面，那你就需要把光源放在模型的外面。
  //点光源位置
  // pointLight.position.set(40, 20, 20)

  // 光源添加到场景
  // 光源和网格模型Mesh对应一样是三维场景的一部分，自然需要添加到三维场景中才能起作用。
  // scene.add(pointLight) //点光源添加到场景中

  const texLoader = new THREE.TextureLoader()
  // .load()方法加载图像，返回一个纹理对象Texture
  const texture = texLoader.load('../../../../public/imgs/macpro.jpg')
  texture.encoding = THREE.sRGBEncoding //和渲染器.outputEncoding一样值

  // 创建GLTF加载器对象
  const loader = new GLTFLoader()

  // loader.load('../../../../public/files/gltf/bag2.glb', function (gltf) {
  //   console.log('gltf对象场景属性', gltf.scene)
  //   const mesh = gltf.scene.children[0] //获取Mesh
  //   mesh.material.map = texture //更换不同风格的颜色贴图
  // })

  loader.load('../../../../public/files/gltf/bag2.glb', function (gltf) {
    // console.log('控制台查看加载gltf文件返回的对象结构', gltf)

    // 返回的场景对象gltf.scene插入到threejs场景中
    // const mesh = gltf.scene.children[0] //获取Mesh
    // mesh.material.map = texture //更换不同风格的颜色贴图
    scene.add(gltf.scene)
    // 查看gltf所有颜色贴图的.encoding值
    gltf.scene.traverse(function (obj) {
      if (obj.isMesh) {
        if (obj.material.map) {
          //判断是否存在贴图
          console.log('.encoding', obj.material.map.encoding)
          obj.material.map = texture //更换不同风格的颜色贴图
        }
      }
    })
    // // .encoding显示3001，说明是THREE.sRGBEncoding
    // console.log('.encoding', mesh.material.map.encoding)
  })

  // a: 辅助观察坐标系
  // 坐标轴颜色红R、绿G、蓝B分别对应坐标系的x、y、z轴，对于three.js的3D坐标系默认y轴朝上。
  const axesHelper = new THREE.AxesHelper(150)
  scene.add(axesHelper)

  const width = 800 //宽度
  const height = 500 //高度
  // 7、实例化一个透视投影相机对象（透视投影相机PerspectiveCamera）
  const camera: any = new THREE.PerspectiveCamera(30, width / height, 1, 3000)

  // 8、相机位置.position
  camera.position.set(10, 10, 10)

  // 10、创建WebGL渲染器WebGLRenderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true // 扛锯齿
  })

  // 11、设置Canvas画布尺寸.setSize()
  renderer.setSize(width, height) //设置three.js渲染区域的尺寸(像素px)
  //解决加载gltf格式模型纹理贴图和原图不一样问题
  renderer.outputEncoding = THREE.sRGBEncoding

  // 12、渲染器WebGLRenderer执行渲染方法.render()就可以生成一个Canvas画布(照片)，并把三维场景Scene呈现在canvas画布上面,你可以把.render()理解为相机的拍照动作“咔”
  // renderer.render(scene, camera)

  // 设置相机控件轨道控制器OrbitControls

  camera.lookAt(0, 0, 0)
  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  // 相机控件.target属性在OrbitControls.js内部表示相机目标观察点，默认0,0,0
  // console.log('controls.target', controls.target);
  controls.target.set(0, 0, 0)
  controls.update() //update()函数内会执行camera.lookAt(controls.targe)

  // // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  // controls.addEventListener('change', function () {
  //   renderer.render(scene, camera) //执行渲染操作
  // }) //监听鼠标、键盘事件

  // 设置了渲染循环,相机控件OrbitControls就不用再通过事件change执行renderer.render(scene, camera);，毕竟渲染循环一直在执行renderer.render(scene, camera);。

  // 13、Canvas画布插入到任意HTML元素中
  document.getElementById('scene12')!.appendChild(renderer.domElement)

  function render() {
    renderer.render(scene, camera) //执行渲染操作
    requestAnimationFrame(render) //请求再次执行渲染函数render，渲染下一帧
  }
  render()
}
</script>
