<template>
	<div class="scene" id="scene"></div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

import { reactive, onMounted } from 'vue'

const state = reactive({
	base3d: {},
	gui: {},
	camera: {}
})
let gui

let scene, renderer, labelRenderer

const layers = {
	'Toggle Name': function () {
		state.camera.layers.toggle(0)
	},
	'Toggle Mass': function () {
		state.camera.layers.toggle(1)
	},
	'Enable All': function () {
		state.camera.layers.enableAll()
	},

	'Disable All': function () {
		state.camera.layers.disableAll()
	}
}

const clock = new THREE.Clock()
const textureLoader = new THREE.TextureLoader()

let moon

onMounted(() => {
	init()
	animate()
})

const init = () => {
	const EARTH_RADIUS = 1
	const MOON_RADIUS = 0.27


	// 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
	// const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);

	// 创建相机
	state.camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1, 2000)
	state.camera.position.set(10, 15, 30)
	state.camera.layers.enableAll()
	state.camera.layers.toggle(1)

	state.camera.lookAt(0, 0, 0)

	// 创建场景
	scene = new THREE.Scene()

	// 创建平行光
	const dirLight = new THREE.DirectionalLight(0xffffff)
	dirLight.position.set(0, 0, 1)
	dirLight.layers.enableAll()
	scene.add(dirLight)

	// 辅助坐标
	const axesHelper = new THREE.AxesHelper(5)
	axesHelper.layers.enableAll()
	scene.add(axesHelper)

	//创建球
	const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16)
	// 材质
	const earthMaterial = new THREE.MeshPhongMaterial({
		specular: 0x333333,
		shininess: 5,
		map: textureLoader.load('../../../../public/textures/planets/earth_atmos_2048.jpg'),
		specularMap: textureLoader.load('../../../../public/textures/planets/earth_specular_2048.jpg'),
		normalMap: textureLoader.load('../../../../public/textures/planets/earth_normal_2048.jpg'),
		normalScale: new THREE.Vector2(0.85, 0.85)
	})
	const earth = new THREE.Mesh(earthGeometry, earthMaterial)
	scene.add(earth)

	const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16)
	const moonMaterial = new THREE.MeshPhongMaterial({
		shininess: 5,
		map: textureLoader.load('../../../../public/textures/planets/moon_1024.jpg')
	})
	moon = new THREE.Mesh(moonGeometry, moonMaterial)
	scene.add(moon)

	

	//
	earth.layers.enableAll()
	moon.layers.enableAll()

	// 把HTML元素作为标签标注三维场景。
	const earthDiv = document.createElement('div')
	earthDiv.className = 'label'
	earthDiv.textContent = 'Earth'
	earthDiv.style.marginTop = '-1em'
	const earthLabel = new CSS2DObject(earthDiv)
	earthLabel.position.set(0, EARTH_RADIUS, 0)
	earth.add(earthLabel)
	earthLabel.layers.set(0)

	const earthMassDiv = document.createElement('div')
	earthMassDiv.className = 'label'
	earthMassDiv.textContent = '5.97237e24 kg'
	earthMassDiv.style.marginTop = '-1em'
	const earthMassLabel = new CSS2DObject(earthMassDiv)
	earthMassLabel.position.set(0, -2 * EARTH_RADIUS, 0)
	earth.add(earthMassLabel)
	earthMassLabel.layers.set(1)

	const moonDiv = document.createElement('div')
	moonDiv.className = 'label'
	moonDiv.textContent = 'Moon'
	moonDiv.style.marginTop = '-1em'
	const moonLabel = new CSS2DObject(moonDiv)
	moonLabel.position.set(0, MOON_RADIUS, 0)
	moon.add(moonLabel)
	moonLabel.layers.set(0)

	const moonMassDiv = document.createElement('div')
	moonMassDiv.className = 'label'
	moonMassDiv.textContent = '7.342e22 kg'
	moonMassDiv.style.marginTop = '-1em'
	const moonMassLabel = new CSS2DObject(moonMassDiv)
	moonMassLabel.position.set(0, -2 * MOON_RADIUS, 0)
	moon.add(moonMassLabel)
	moonMassLabel.layers.set(1)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer()
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)
	// document.body.appendChild( renderer.domElement );
	document.getElementById('scene')!.appendChild(renderer.domElement)

	labelRenderer = new CSS2DRenderer()
	labelRenderer.setSize(window.innerWidth, window.innerHeight)
	labelRenderer.domElement.style.position = 'absolute'
	labelRenderer.domElement.style.top = '0px'
	document.body.appendChild(labelRenderer.domElement)

	const controls = new OrbitControls(state.camera, labelRenderer.domElement)
	controls.minDistance = 5
	controls.maxDistance = 100

	//

	window.addEventListener('resize', onWindowResize)

	initGui()
}
function onWindowResize() {
	state.camera.aspect = window.innerWidth / window.innerHeight

	state.camera.updateProjectionMatrix()

	renderer.setSize(window.innerWidth, window.innerHeight)

	labelRenderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
	requestAnimationFrame(animate)

	const elapsed = clock.getElapsedTime()

	moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5)

	renderer.render(scene, state.camera)
	labelRenderer.render(scene, state.camera)
}

//

function initGui() {
	gui = new GUI()

	gui.add(layers, 'Toggle Name')
	gui.add(layers, 'Toggle Mass')
	gui.add(layers, 'Enable All')
	gui.add(layers, 'Disable All')
}
</script>
