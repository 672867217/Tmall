'use strict'
require('./index.css');
require('@/common/nav/index.js');
require('@/common/header/index.js');
var _mm = require('util/mm.js');

require('util/swiper/swiper-3.3.1.min.css');
require('util/swiper/swiper-3.3.1.min.js');

var templateBanner = require('./banner.string');

var bannerHtml = _mm.renderHtml(templateBanner);
$('.banner-con').html(bannerHtml);

var mySwiper = new Swiper('.swiper-container', {
    autoplay: 2000, // 可选选项，自动滑动   2000ms
    // 手动滑动之后，依然可以自动轮播
    autoplayDisableOnInteraction: false,
    // 分页器
    pagination: '.swiper-pagination',
    // 环路(不影响自动轮播)
    loop: true,
    effect: 'coverflow',
    slidesPerView: 2,
    centeredSlides: true,
    coverflow: {
        rotate: 30,
        stretch: 10,
        depth: 60,
        modifier: 2,
        slideShadows: true
    }
});