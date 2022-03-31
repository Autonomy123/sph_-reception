import Mock from 'mockjs'
import banner from './banner.json'
import floor from './floor.json'

//mock数据：第一个参数是请求地址  第二个是参数
Mock.mock('/mock/banner', {code: 200, data: banner})
Mock.mock('/mock/floor', {code: 200, data: floor})