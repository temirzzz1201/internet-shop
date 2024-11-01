// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import {
//   placeProduct,
//   getProducts,
//   deleteProduct,
//   updateProduct,
//   getProductDetail
// } from '@/actions/clientActions';
// import { IIProducts, IIProduct } from '../types';

// export const initialState: IIProducts = {
//   products: [],
//   isLoading: false,
//   error: null,
// };

// const productSlice = createSlice({
//   name: 'products',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(placeProduct.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(
//         placeProduct.fulfilled,
//         (state, action: PayloadAction<IIProduct>) => {
//           state.isLoading = false;

//           if (!Array.isArray(state.products)) {
//             state.products = [];
//           }
//         }
//       )
//       .addCase(placeProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload ?? 'Что-то пошло не так';
//       })
//       .addCase(getProducts.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(
//         getProducts.fulfilled,
//         (state, action: PayloadAction<IIProduct[]>) => {
//           state.isLoading = false;
//           state.products = action.payload;
//         }
//       )
//       .addCase(getProducts.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload ?? 'Что-то пошло не так';
//       })


//       .addCase(getProductDetail.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(getProductDetail.fulfilled, (state, action: PayloadAction<IIProduct>) => {
//         state.isLoading = false;
//         state.products = action.payload; // Присваиваем один продукт
//       })
//       .addCase(getProductDetail.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload ?? 'Что-то пошло не так';
//       })

//       .addCase(
//         deleteProduct.fulfilled,
//         (state, action: PayloadAction<number>) => {
//           state.isLoading = false;
//           if (Array.isArray(state.products)) {
//             state.products = state.products.filter(
//               (product) => Number(product.id) !== action.payload
//             );
//           }
//         }
//       )
//       .addCase(deleteProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload ?? 'Не удалось удалить продукт';
//       })
//       .addCase(
//         updateProduct.fulfilled,
//         (state, action: PayloadAction<IIProduct>) => {
//           state.isLoading = false;
//           if (Array.isArray(state.products)) {
//             const index = state.products.findIndex(
//               (product) => product.id === action.payload.id
//             );
//             if (index !== -1) {
//               state.products[index] = action.payload;
//             }
//           }
//         }
//       )
//       .addCase(updateProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload ?? 'Не удалось обновить продукт';
//       });
//   },
// });

// export default productSlice.reducer;


import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  placeProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProductDetail
} from '@/actions/clientActions';
import { IIProducts, IIProduct } from '../types';

export const initialState: IIProducts = {
  products: [],
  currentProduct: null, // Добавлено поле для хранения текущего продукта
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        placeProduct.fulfilled,
        (state, action: PayloadAction<IIProduct>) => {
          state.isLoading = false;
          state.products.push(action.payload); // Добавляем новый продукт в массив
        }
      )
      .addCase(placeProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Что-то пошло не так';
      })
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getProducts.fulfilled,
        (state, action: PayloadAction<IIProduct[]>) => {
          state.isLoading = false;
          state.products = action.payload;
        }
      )
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Что-то пошло не так';
      })
      
      .addCase(getProductDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductDetail.fulfilled, (state, action: PayloadAction<IIProduct>) => {
        state.isLoading = false;
        state.currentProduct = action.payload; // Сохраняем текущий продукт
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось получить детали продукта';
      })

      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.isLoading = false;
          state.products = state.products.filter(
            (product) => Number(product.id) !== action.payload
          );
        }
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось удалить продукт';
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<IIProduct>) => {
          state.isLoading = false;
          const index = state.products.findIndex(
            (product) => product.id === action.payload.id
          );
          if (index !== -1) {
            state.products[index] = action.payload; // Обновляем продукт в массиве
          }
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось обновить продукт';
      });
  },
});

export default productSlice.reducer;
