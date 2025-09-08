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
            .when('/product', {
                controller: 'ProductController',
                templateUrl: 'view/product.html',
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

myApp.controller("ProductController", function($scope, $timeout) {
    $timeout(function () {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const closeBtn = modal.querySelector('.close');

        document.querySelectorAll(".catalog-item img").forEach(function(img) {
            img.addEventListener("click", function(e) {
                e.preventDefault();
                modal.style.display = "flex";
                modalImg.src = this.src;
                document.body.style.overflow = 'hidden';
            });
        });

        closeBtn.addEventListener("click", function () {
            modal.style.display = "none";
            document.body.style.overflow = '';
        });

        modal.addEventListener("click", function(e) {
            if (e.target === modal) {
                modal.style.display = "none";
                document.body.style.overflow = '';
            }
        });

        document.addEventListener("keydown", function(e) {
            if (e.key === "Escape") {
                modal.style.display = "none";
                document.body.style.overflow = '';
            }
        });
    }, 0); 
});

myApp.controller("ProductViewController", function($scope, $http, $location) {
    var id = parseInt($location.search().id);

    $http.get('json/product.json')
        .then(function(response) {
            var products = response.data;
            $scope.product = products.find(function(p) {
                return p.id === id;
            });
        })
        .catch(function(err) {
            console.error('Error loading product:', err);
        });
});

myApp.run(function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function() {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
});
