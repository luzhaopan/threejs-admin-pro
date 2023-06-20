<template>
  <div class="scene1" id="scene1"></div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'

import { onMounted } from 'vue'

let camera, scene, renderer

let scene2, renderer2

const frustumSize = 500

const c_width = window.innerWidth - 260
const c_height = window.innerHeight

onMounted(() => {
  init()
  animate()
})

function init() {
  const aspect = c_width / c_height
  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    1,
    1000
  )

  camera.position.set(-200, 200, 200)

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  scene2 = new THREE.Scene()

  const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
    wireframeLinewidth: 1,
    side: THREE.DoubleSide
  })

  // left
  createPlane(
    100,
    100,
    'chocolate',
    new THREE.Vector3(-50, 0, 0),
    new THREE.Euler(0, -90 * THREE.MathUtils.DEG2RAD, 0)
  )
  // right
  createPlane(100, 100, 'saddlebrown', new THREE.Vector3(0, 0, 50), new THREE.Euler(0, 0, 0))
  // top
  createPlane(
    100,
    100,
    'yellowgreen',
    new THREE.Vector3(0, 50, 0),
    new THREE.Euler(-90 * THREE.MathUtils.DEG2RAD, 0, 0)
  )
  // bottom
  createPlane(
    300,
    300,
    'seagreen',
    new THREE.Vector3(0, -50, 0),
    new THREE.Euler(-90 * THREE.MathUtils.DEG2RAD, 0, 0)
  )

  //

  renderer = new THREE.WebGLRenderer()

  // 设置设备像素比.setPixelRatio()
  // 如果你遇到你的canvas画布输出模糊问题，注意设置renderer.setPixelRatio(window.devicePixelRatio)。
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(c_width, c_height)
  document.getElementById('scene1').appendChild(renderer.domElement)

  // CSS3DObject把一个文档dom对象转化成three可用的Object3D对象
  // CSS3DRenderer就是负责渲染这个CSS3DObject的渲染器
  renderer2 = new CSS3DRenderer()
  renderer2.setSize(c_width, c_height)
  renderer2.domElement.style.position = 'absolute'
  renderer2.domElement.style.top = '30px'
  document.getElementById('scene1').appendChild(renderer2.domElement)

  // 相机旋转控制
  const controls = new OrbitControls(camera, renderer2.domElement)
  controls.minZoom = 0.5
  controls.maxZoom = 2

  function createPlane(width, height, cssColor, pos, rot) {
    const element = document.createElement('div')
    element.style.width = width + 'px'
    element.style.height = height + 'px'
    element.style.opacity = 0.75
    element.style.background = cssColor

    const object = new CSS3DObject(element)
    object.position.copy(pos)
    object.rotation.copy(rot)
    scene2.add(object)

    // PlaneGeometry可以用来创建非常简单的矩形
    const geometry = new THREE.PlaneGeometry(width, height)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(object.position)
    mesh.rotation.copy(object.rotation)
    scene.add(mesh)
  }

  window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
  const aspect = c_width / c_height

  camera.left = (-frustumSize * aspect) / 2
  camera.right = (frustumSize * aspect) / 2
  camera.top = frustumSize / 2
  camera.bottom = -frustumSize / 2

  camera.updateProjectionMatrix()

  renderer.setSize(c_width, c_height)

  renderer2.setSize(c_width, c_height)
}

function animate() {
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
  renderer2.render(scene2, camera)
}
</script>
