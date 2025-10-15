var myApp = angular.module('myApp', ['ngRoute']); 

myApp.config([
    '$routeProvider',
    '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix(''); 
        $routeProvider
            .when('/', { 
                controller: 'HomeController',
                templateUrl: 'view/home.html',
            })
            .when('/aboutus', {
                controller: 'AboutUsController',
                templateUrl: 'view/aboutus.html',
            })
            .when('/contactus', {
                controller: 'ContactUsController',
                templateUrl: 'view/contactus.html',
            })
            .when('/product-view', {
                controller: 'ProductViewController',
                templateUrl: 'view/product-view.html',
            })
            .when('/product-cat', {
                controller: 'ProductCatController',
                templateUrl: 'view/product-cat.html',
            })
            .otherwise({ redirectTo: '/' });
    }
]); 

myApp.controller("HeaderController", function($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('menu-toggle'); 
    const navMenu = document.querySelector('.head-links'); 

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
});

myApp.run(function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function() {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
});

const menuBtn = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('header nav ul');

if (menuBtn && navLinks) { // ✅ ADDED: hindari error jika elemen tidak ditemukan
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}

myApp.controller("ProductViewController", function($scope, $http, $location, $timeout) {
    $scope.currentLang = localStorage.getItem("language") || "en";

    $scope.modalVisible = false;
    $scope.modalImage = "";

    $scope.openModal = function(src) {
        $scope.modalImage = src;
        $scope.modalVisible = true;
        document.body.style.overflow = 'hidden';

        // ✅ ADDED: tampilkan modal dengan elemen DOM
        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("modalImage");
        if (modal && modalImg) {
            modal.style.display = "flex";
            modalImg.src = src;
        }
    };

    $scope.closeModal = function() {
        $scope.modalVisible = false;
        $scope.modalImage = "";
        document.body.style.overflow = '';

        // ✅ ADDED: sembunyikan modal
        const modal = document.getElementById("imageModal");
        if (modal) {
            modal.style.display = "none";
        }
    };

    // ✅ ADDED: agar tombol close (span.close) juga bisa menutup modal
    document.addEventListener("click", function(e) {
        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("modalImage");
        const closeBtn = document.querySelector("#imageModal .close");

        if (!modal) return;

        if (e.target === modal || e.target === closeBtn) {
            modal.style.display = "none";
            document.body.style.overflow = '';
            $scope.$applyAsync(() => {
                $scope.modalVisible = false;
                $scope.modalImage = "";
            });
        }
    });

    const productId = parseInt($location.search().id, 10);

    function loadProduct() {
        $http.get('json/product.json')
        .then(function(response) {
            const allProducts = response.data || {};
            const langProducts = allProducts[$scope.currentLang] || [];

            let found = langProducts.find(p => Number(p.id) === Number(productId));
            if (!found) {
                const merged = Object.values(allProducts).flat();
                found = merged.find(p => Number(p.id) === Number(productId));
            }

            $scope.product = found || null;
        })
        .catch(function(err) {
            console.error('Error loading product.json', err);
            $scope.product = null;
        });
    }

    loadProduct();

    window.addEventListener('languageChanged', function() {
        $scope.$applyAsync(function() {
            $scope.currentLang = localStorage.getItem('language') || 'en';
            loadProduct();
        });
    });

    $timeout(function(){}, 0);
});
