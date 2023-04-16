import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';
import { OrderItem } from '../models/order';
import { MyOrderItem } from '../models/my-order';
import { WishListItem } from '../models/wishlist';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  readonly baseUrl = 'http://localhost:5062/api/';

  isLoggedIn = false;

  constructor(private http: HttpClient, public router: Router) {}

  UserData: User = new User();
  errorMessage = '';
  myOrderList: MyOrderItem[] = [];
  singleOrderItem: MyOrderItem = new MyOrderItem();
  productList: Product[] = [];
  ProductData: Product = new Product();
  allCartItems: CartItem[] = [];
  singleCartItem: CartItem = new CartItem();

  //User API Login
  userLogin(email: string, password: string) {
    this.http.get(this.baseUrl + 'Users').subscribe((response) => {
      const allUsers = response as User[];

      if (allUsers != null) {
        allUsers.forEach((user) => {
          if (user.Email == email) {
            if (user.Password == password) {
              this.UserData = user;
              this.isLoggedIn = true;
              this.router.navigate(['']);
              this.getAllCartItems();
              this.getWishListItem();
            } else {
              this.errorMessage = 'Incorrect password !';
            }
          } else {
            this.errorMessage = 'Email not registered, Please register first !';
          }
        });
      }
    });
  }

  postUser(email: string, password: string) {
    this.UserData.Email = email;
    this.UserData.Password = password;

    this.http.post(this.baseUrl + 'Users', this.UserData).subscribe(
      (res) => {
        this.router.navigate(['login_page']);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

  putUserData() {
    return this.http.put(
      this.baseUrl + 'Users/' + this.UserData.UserId,
      this.UserData
    );
  }

  //Fetching products datas

  getAllProducts() {
    this.http.get(this.baseUrl + 'ProductItems').subscribe(
      (response) => {
        this.productList = response as Product[];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  postAllProducts() {
    this.list.forEach((p) => {
      p.ProductId = 0;
      this.http.post(this.baseUrl + 'ProductItems', p).subscribe(
        (res) => {},
        (error) => {}
      );
    });
  }

  //Fetching cart items

  getAllCartItems() {
    this.allCartItems = [];
    this.http.get(this.baseUrl + 'CartItems').subscribe(
      (response) => {
        const list = response as CartItem[];
        list.forEach((item) => {
          if (item.UserId == this.UserData.UserId) {
            this.allCartItems.push(item);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSingleCartItem(id: number) {
    this.http.get(this.baseUrl + 'CartItems/' + id).subscribe((res) => {
      this.singleCartItem = res as CartItem;
    });
  }

  postCartItem(cartItem: CartItem) {
    this.http.post(this.baseUrl + 'CartItems', cartItem).subscribe(
      (res) => {
        alert('Item added to cart');
        this.getAllCartItems();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  putCartItem(cartItem: CartItem) {
    this.http
      .put(this.baseUrl + 'CartItems/' + cartItem.Id, cartItem)
      .subscribe(
        (res) => {
          this.getAllCartItems();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  deleteCartItem() {
    this.http
      .delete(this.baseUrl + 'CartItems/' + this.singleCartItem.Id)
      .subscribe(
        (res) => {
          this.getAllCartItems();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  //My order list

  getMyOrders() {
    this.http.get(this.baseUrl + 'OrderItems').subscribe(
      (response) => {
        const orderList = response as OrderItem[];

        orderList.forEach((item) => {
          if (item.UserId == this.UserData.UserId) {
            const myOrderItem: MyOrderItem = new MyOrderItem();
            myOrderItem.Order = item;

            this.getSingleProduct(item.ProductId).subscribe(
              (res) => {
                myOrderItem.Product = res as Product;
              },
              (error) => {
                console.log(error);
              }
            );

            this.myOrderList.push(myOrderItem);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSingleProduct(id: number) {
    return this.http.get(this.baseUrl + 'ProductItems/' + id);
  }

  //Post order data
  postOrderData(OrderData: OrderItem) {
    this.http.post(this.baseUrl + 'OrderItems', OrderData).subscribe(
      (res) => {
        this.allCartItems.forEach((item) => {
          this.http.delete(this.baseUrl + 'CartItems/' + item.Id).subscribe(
            (res) => {
              this.allCartItems.splice(this.allCartItems.indexOf(item), 1);
              console.log(res);
            },
            (error) => {
              console.log(error);
            }
          );
        });

        if (confirm('Order placed !')) {
          this.router.navigate(['']);
        } else {
          this.router.navigate(['']);
        }

        return;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //Wishlist API
  MyWishList: WishListItem[] = [];

  postWishListItem(w: WishListItem) {
    this.http.get(this.baseUrl + 'WishlistItems').subscribe(
      (res) => {
        let list = res as WishListItem[];
        let alreadyExits: boolean = false;
        list.forEach((item) => {
          if (item.ProductId == w.ProductId) {
            alreadyExits = true;
          }
        });

        if (!alreadyExits) {
          this.http.post(this.baseUrl + 'WishlistItems', w).subscribe(
            (res) => {
              alert('Item added to wishlist !');
              this.getWishListItem();
            },
            (error) => {
              console.log(error);
            }
          );
        } else {
          alert("Product already exits in wishlist !");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getWishListItem() {
    this.MyWishList = [];
    this.http.get(this.baseUrl + 'WishlistItems').subscribe(
      (res) => {
        this.MyWishList = res as WishListItem[];
      },
      (error) => {
        console.log(error);
      }
    );
    this.MyWishList = this.MyWishList.filter((elem, index, self) => {
      return index === self.indexOf(elem);
    });
  }

  list: Product[] = [
    {
      ProductId: 1,
      ProductName: 'Nike blue & black running shoes',
      BrandName: 'Nike',
      Category: 'Shoes/Sleepers',
      ImageUrl:
        'https://images-na.ssl-images-amazon.com/images/I/41tB8m00YwL.jpg',
      Price: 699,
      Rating: 4,
      Description:
        'Product Dimensions ‏ : ‎ 36 x 23 x 16 cm; 550 Grams\r\nDate First Available ‏ : ‎ 21 February 2023\r\nManufacturer ‏ : ‎ NIKE INDIA PVT LTD\r\nASIN ‏ : ‎ B0BNJNQBTD\r\nItem model number ‏ : ‎ DH4071-010\r\nCountry of Origin ‏ : ‎ Vietnam\r\nDepartment ‏ : ‎ mens\r\nManufacturer ‏ : ‎ NIKE INDIA PVT LTD, NIKE INDIA PVT LTD,GROUND & 1ST FLOOR OLYMPIA BUILDING,NO 66/1 BAGMANE TECH PARK,CV RAMAN NAGAR BANGALORE-560093 INDIA\r\nPacker ‏ : ‎ NIKE INDIA PVT LTD,GROUND & 1ST FLOOR OLYMPIA BUILDING,NO 66/1 BAGMANE TECH PARK,CV RAMAN NAGAR BANGALORE-560093 INDIA\r\nImporter ‏ : ‎ NIKE INDIA PVT LTD,GROUND & 1ST FLOOR OLYMPIA BUILDING,NO 66/1 BAGMANE TECH PARK,CV RAMAN NAGAR BANGALORE-560093 INDIA\r\nItem Weight ‏ : ‎ 550 g\r\nItem Dimensions LxWxH ‏ : ‎ 36 x 23 x 16 Centimeters\r\nGeneric Name ‏ : ‎ Running Shoe',
    },
    {
      ProductId: 3,
      ProductName: 'Sony | Over the ear wireless headphone',
      BrandName: 'Sony',
      Category: 'Electronics',
      ImageUrl:
        'https://media.istockphoto.com/id/1306073552/vector/black-realistic-headphones-gaming-headset-listening-audio-electronic-device-3d-stereo-earbuds.jpg?s=612x612&w=0&k=20&c=daYW6kyFW9w1aIDs30DboVRsbedL2mR8zXpsrjRq_94=',
      Price: 3999,
      Rating: 4,
      Description:
        'Playback- The mighty 500mAh battery capacity offers a superior playback time of up to 20 Hours\r\nDrivers- Its 50mm dynamic drivers help pump out immersive audio all day long\r\nEar Cushions- It has been ergonomically designed and structured as an over-ear headphone to provide the best user experience with its plush padded earcushions\r\nPhysical Noise Isolation- It comes with physical Noise Isolation feature for pure audio bliss\r\nConnectivity- Tap into instant wireless connectivity with the latest Bluetooth V5.0\r\nDual Modes- It comes with dual connectivity, wireless via its bluetooth and wired with its aux port\r\n1 year warranty from the date of purchase',
    },
    {
      ProductId: 4,
      ProductName: ' Digital SLR Camera (Black) with EF S18-55 is II Lens',
      BrandName: 'Canon',
      Category: 'Elelctronics',
      ImageUrl:
        'https://cdn.shopify.com/s/files/1/0070/7032/files/image5_4578a9e6-2eff-4a5a-8d8c-9292252ec848.jpg?v=1620247043',
      Price: 37990,
      Rating: 5,
      Description:
        'Sensor: APS-C CMOS Sensor with 24.1 MP (high resolution for large prints and image cropping). Transmission frequency (central frequency):Frequency: 2 412 to 2 462MHz. Standard diopter :-2.5 - +0.5m-1 (dpt);ISO: 100-6400 sensitivity range (critical for obtaining grain-free pictures, especially in low light)\r\nImage Processor: DIGIC 4+ with 9 autofocus points (important for speed and accuracy of autofocus and burst photography);Video Resolution: Full HD video with fully manual control and selectable frame rates (great for precision and high-quality video work)\r\nConnectivity: WiFi, NFC and Bluetooth built-in (useful for remotely controlling your camera and transferring pictures wirelessly as you shoot)\r\nLens Mount: EF-S mount compatible with all EF and EF-S lenses (crop-sensor mount versatile and compact, especially when used with EF-S lenses); Country of Origin: Taiwan\r\nCompatible Mountings: Universal Tripod Mount; Photo Sensor Technology: Size:[Unit:Frames Per Second, Value:Aps-C ], Technology:[Value:Cmos ]',
    },
    {
      ProductId: 5,
      ProductName: 'HIFI subwoofer amplifier board',
      BrandName: 'Generic',
      Category: 'Electronics',
      ImageUrl:
        'https://c.pxhere.com/photos/fb/56/motherboard_processor_recovery_micro_hardware_chip_byte_circuit-1341730.jpg!s2',
      Price: 549,
      Rating: 3,
      Description:
        'Model: TPA3116D2\r\nSupply Voltage: DC 12-24V\r\nChip: TPA3116*2\r\nChannel Type: 3 Channels (Left Channel, Right Channel, Subwoofer)\r\nOutput Power: 50W*2 + 100W*1 Subwoofer',
    },
    {
      ProductId: 6,
      ProductName: 'Bluetooth speaker',
      BrandName: 'Generic',
      Category: 'Electronics',
      ImageUrl:
        'https://www.shutterstock.com/image-photo/black-bluetooth-speaker-isolated-on-260nw-1837928143.jpg',
      Price: 599,
      Rating: 3,
      Description:
        'Power- Get ready to be enthralled by the 10W RMS stereo sound on Stone 352 portable wireless speakers.\r\nIP Rating- With a speaker that offers an IPX7 marked resistance against water and splashes, you can enjoy your playlists across terrains in a carefree way. Charging Time About 1.5-2 hours\r\nPlayback- The speaker offers up to a total of 12 hours of playtime per single charge at 60% volume level. Bluetooth Range - 10m\r\nTrue Wireless- It supports TWS functionality, meaning you can connect two Stone 352s together and simultaneously play music on both of them for twice the impact.\r\nModes- You can enjoy your playlists via multiple connectivity modes namely Bluetooth, AUX and TF Card.\r\nControls- You can control playback and adjust volume levels with ease courtesy easy to access controls.',
    },
    {
      ProductId: 7,
      ProductName: 'Nike blue & black running shoes',
      BrandName: 'Nike',
      Category: 'Shoes/Sleepers',
      ImageUrl: 'https://i.ebayimg.com/images/g/ln8AAOSwQftjSaOW/s-l500.jpg',
      Price: 699,
      Rating: 4,
      Description:
        'Product Dimensions ‏ : ‎ 36 x 23 x 16 cm; 550 Grams\r\nDate First Available ‏ : ‎ 21 February 2023\r\nManufacturer ‏ : ‎ NIKE INDIA PVT LTD\r\nASIN ‏ : ‎ B0BNJNQBTD\r\nItem model number ‏ : ‎ DH4071-010\r\nCountry of Origin ‏ : ‎ Vietnam\r\nDepartment ‏ : ‎ mens\r\nManufacturer ‏ : ‎ NIKE INDIA PVT LTD, NIKE INDIA PVT LTD,GROUND & 1ST FLOOR OLYMPIA BUILDING,NO 66/1 BAGMANE TECH PARK,CV RAMAN NAGAR BANGALORE-560093 INDIA\r\nPacker ‏ : ‎ NIKE INDIA PVT LTD,GROUND & 1ST FLOOR OLYMPIA BUILDING,NO 66/1 BAGMANE TECH PARK,CV RAMAN NAGAR BANGALORE-560093 INDIA\r\nImporter ‏ : ‎ NIKE INDIA PVT LTD,GROUND & 1ST FLOOR OLYMPIA BUILDING,NO 66/1 BAGMANE TECH PARK,CV RAMAN NAGAR BANGALORE-560093 INDIA\r\nItem Weight ‏ : ‎ 550 g\r\nItem Dimensions LxWxH ‏ : ‎ 36 x 23 x 16 Centimeters\r\nGeneric Name ‏ : ‎ Running Shoe',
    },
    {
      ProductId: 8,
      ProductName: 'PROCUS-ONE X VR Headset',
      BrandName: 'Procus',
      Category: 'Electronics',
      ImageUrl:
        'https://www.pngitem.com/pimgs/m/31-316474_virtual-reality-headset-png-transparent-png.png',
      Price: 800,
      Rating: 5,
      Description:
        'FULLY IMMERSIVE VIEW: Our VR Headsets feature 40MM lenses with over 100 degrees of field view. This all-in-one game system is built to give you an unimaginable virtual reality experience. Additionally, it supports Android and iOS smartphone models with 4.7" to 6.8" screens and gyroscopes.\r\n✅ COMFORTABLE AND LIGHTWEIGHT: Innovative design with super light ABS plastic and sturdy build quality. With an adjustable headband, head support, and foam face cushion, it is completely comfortable to wear. There is also a built-in IPD adjustment feature and a screen distance adjustment.\r\n✅ PERFECT GIFT: This is a great gift to give on occasions such as birthdays, anniversaries, Christmas, Diwali, and many more. It is a lifetime experience. Your friends and family will love it. We can guarantee you, it will boost your gaming and movie experience by more than 100%.\r\n✅ IMMERSIVE GAMING/MOVIE EXPERIENCE: Download and play VR apps. You will find 300+ apps (recommended: Youtube/Veer/Fulldrive). Insert the cellphone into the 3D virtual headset, put the VR on your head, and adjust the headband. After a few seconds, you are in a private 3D IMAX theater where you can enjoy an immersive 3D experience.\r\n✅ 100% SATISFACTION GURANTEE: The comfort of our customers is our top priority, and we strive to keep them 100% satisfied. All our products are genuine & we are confident you will love them just as much as we do. Feel free to get in touch if you are still not satisfied. It will be a pleasure to assist you.',
    },
    {
      ProductId: 9,
      ProductName: 'Nike Mens Air Zoom Pegasus 39 Running Shoes',
      BrandName: 'Nike',
      Category: 'Shoes/Sleepers',
      ImageUrl:
        'https://c4.wallpaperflare.com/wallpaper/601/305/95/nike-full-hd-wallpaper-preview.jpg',
      Price: 899,
      Rating: 4,
      Description:
        'Product Dimensions ‏ : ‎ 36 x 23 x 16 cm; 550 Grams\r\nDate First Available ‏ : ‎ 21 February 2023\r\nManufacturer ‏ : ‎ NIKE INDIA PVT LTD\r\nASIN ‏ : ‎ B0BNJNQBTD\r\nItem model number ‏ : ‎ DH4071-010\r\nCountry of Origin ‏ : ‎ Vietnam\r\nDepartment ‏ : ‎ mens\r\nManufacturer ‏ : ‎ NIKE INDIA PVT LTD, NIKE INDIA PVT LTD,GROUND & 1ST FLOOR OLYMPIA BUILDING,NO 66/1 BAGMANE TECH PARK,CV RAMAN NAGAR BANGALORE-560093 INDIA\r\nPacker ‏ : ‎ NIKE INDIA PVT LTD,GROUND & 1ST FLOOR OLYMPIA BUILDING,NO 66/1 BAGMANE TECH PARK,CV RAMAN NAGAR BANGALORE-560093 INDIA\r\nImporter ‏ : ‎ NIKE INDIA PVT LTD,GROUND & 1ST FLOOR OLYMPIA BUILDING,NO 66/1 BAGMANE TECH PARK,CV RAMAN NAGAR BANGALORE-560093 INDIA',
    },
    {
      ProductId: 10,
      ProductName: 'Nike light grey running shoes',
      BrandName: 'Nike',
      Category: 'Shoes/Sleepers',
      ImageUrl: 'https://i.ebayimg.com/images/g/9poAAOSwVJBgQtvn/s-l1600.jpg',
      Price: 699,
      Rating: 4,
      Description:
        'Product Dimensions ‏ : ‎ 36 x 23 x 16 cm; 550 Grams\r\nDate First Available ‏ : ‎ 21 February 2023\r\nManufacturer ‏ : ‎ NIKE INDIA PVT LTD\r\nASIN ‏ : ‎ B0BNJNQBTD\r\nItem model number ‏ : ‎ DH4071-010\r\nCountry of Origin ‏ : ‎ Vietnam\r\nDepartment ‏ : ‎ mens\r\nManufacturer ‏ : ‎ NIKE INDIA PVT LTD, NIKE INDIA PVT LTD,GROUND & 1ST FLOOR OLYMPIA BUILDING,NO 66/1 BAGMANE TECH PARK,CV RAMAN NAGAR BANGALORE-560093 INDIA\r\nPacker ‏ : ‎ NIKE INDIA PVT LTD,GROUND & 1ST FLOOR OLYMPIA BUILDING,NO 66/1 BAGMANE TECH PARK,CV RAMAN NAGAR BANGALORE-560093 INDIA\r\nImporter ‏ : ‎ NIKE INDIA PVT LTD,GROUND & 1ST FLOOR OLYMPIA BUILDING,NO 66/1 BAGMANE TECH PARK,CV RAMAN NAGAR BANGALORE-560093 INDIA\r\nItem Weight ‏ : ‎ 550 g\r\nItem Dimensions LxWxH ‏ : ‎ 36 x 23 x 16 Centimeters\r\nGeneric Name ‏ : ‎ Running Shoe',
    },
    {
      ProductId: 11,
      ProductName: 'Omron MC 246 Digital Thermometer',
      BrandName: 'Omron',
      Category: 'Electronics',
      ImageUrl:
        'https://t3.ftcdn.net/jpg/00/98/86/72/360_F_98867203_MRMi9kxjgRNIHyY9VzucMsGdowyiiLDu.jpg',
      Price: 999,
      Rating: 5,
      Description:
        'For oral, rectal and underarm temperature measurement\r\n3-digit, + degree celcius (degree fahrenheit) display in 0.1 degree increment, beeps when measurement is completed.Flexible Tip : No\r\nMeasurement Accuracy : ±0.1 degree celcius (32.0 to 42.0 degree celcius)\r\n±0.2 degree fahrenheit (89.6 to 107.6 degree fahrenheit)\r\nAuto off function : Approximately 30 minutes after use or 3 minutes when not been used',
    },
    {
      ProductId: 12,
      ProductName: 'Wireless bluetooth keyboard',
      BrandName: 'Generic',
      Category: 'Electronics',
      ImageUrl: 'https://cf.shopee.ph/file/35075890c3318750589c1f8540324268',
      Price: 600,
      Rating: 4,
      Description:
        "Multi-Device Connectivity : Pair up to 3 wireless devices at once with the simple touch of an Easy-Switch button. Easy-Switch lets you connect any Bluetooth device that supports an external keyboard, including an iPhone, iPad android tablet or Windows PC. Palm Rest : No\r\nSmall and Light : This lightweight, small-sized Bluetooth keyboard gives you full functionality within a minimalist layout. It takes up less space in your bag and at your desk, so you can take it wherever you need to type.\r\nExtended Battery : Skip the hassle of frequently replacing batteries with up to 2 years life for this Bluetooth keyboard - depending on use.\r\nType on Anything : Enjoy desktop typing on a mobile, tablet or laptop with this universal wireless keyboard, which perfectly adapts to Windows, Mac, Chrome OS android, iOS or AppleTV. Detects your specific device and automatically maps keys to give you your familiar shortcuts.\r\nLasting Reliability : Rely on the global leader for the computer mouse and keyboard with our 2 years manufacturer's guarantee and full product support. Compatible with wired, wireless, Bluetooth or gaming mice.\r\nUpgrade to K780 Keyboard : For more productivity and comfort and numpad for efficient data inputs, Bluetooth/USB, scooped keys, cradle to hold your phone.",
    },
  ];
}
