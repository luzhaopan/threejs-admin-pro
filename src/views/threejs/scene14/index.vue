<template>
  <div class="scene14" id="scene14"></div>
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

  //环境光:没有特定方向，整体改变场景的光照明暗
  const ambient = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambient)

  // a: 辅助观察坐标系
  // 坐标轴颜色红R、绿G、蓝B分别对应坐标系的x、y、z轴，对于three.js的3D坐标系默认y轴朝上。
  const axesHelper = new THREE.AxesHelper(150)
  scene.add(axesHelper)

  // 三维样条曲线
  const path: any = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-50, 20, 90),
    new THREE.Vector3(-10, 40, 40),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, -60, 0),
    new THREE.Vector3(90, -40, 60),
    new THREE.Vector3(120, 30, 30)
  ])
  // 样条曲线path作为TubeGeometry参数生成管道
  const geometry = new THREE.TubeGeometry(path, 200, 5, 30)
  const texLoader = new THREE.TextureLoader()
  //纹理贴图
  const texture = texLoader.load('../../../../public/imgs/gucci.jpg')
  //UV坐标U方向阵列模式
  texture.wrapS = THREE.RepeatWrapping
  //纹理沿着管道方向阵列(UV坐标U方向)
  texture.repeat.x = 10
  const material: any = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide //双面显示看到管道内壁
  })
  const mesh = new THREE.Mesh(geometry, material)

  scene.add(mesh)

  const width = 800 //宽度
  const height = 500 //高度
  // 7、实例化一个透视投影相机对象（透视投影相机PerspectiveCamera）
  const camera: any = new THREE.PerspectiveCamera(30, width / height, 1, 3000)

  // 8、相机位置.position
  camera.position.set(200, 200, 200)

  // 10、创建WebGL渲染器WebGLRenderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true // 扛锯齿
  })

  // 11、设置Canvas画布尺寸.setSize()
  renderer.setSize(width, height) //设置three.js渲染区域的尺寸(像素px)
  //解决加载gltf格式模型纹理贴图和原图不一样问题
  renderer.outputEncoding = THREE.sRGBEncoding

  // 13、Canvas画布插入到任意HTML元素中
  document.getElementById('scene14')!.appendChild(renderer.domElement)

  // 从曲线上等间距获取一定数量点坐标
  const pointsArr = path.getSpacedPoints(500)
  // 渲染循环
  let i = 0 //在渲染循环中累加变化
  function render() {
    if (i < pointsArr.length - 1) {
      // 相机位置设置在当前点位置
      camera.position.copy(pointsArr[i])
      // 曲线上当前点pointsArr[i]和下一个点pointsArr[i+1]近似模拟当前点曲线切线
      // 设置相机观察点为当前点的下一个点，相机视线和当前点曲线切线重合
      camera.lookAt(pointsArr[i + 1])
      i += 1 //调节速度
    } else {
      i = 0
    }
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  render()
}
</script>
