'use client';
import { vars } from 'nativewind';

export const config = {
  light: vars({
    /* Primary — accent-green (#3D8A5A) */
    '--color-primary-0': '240 249 244',
    '--color-primary-50': '220 243 231',
    '--color-primary-100': '184 232 208',
    '--color-primary-200': '150 210 179',
    '--color-primary-300': '110 185 145',
    '--color-primary-400': '80 160 112',
    '--color-primary-500': '61 138 90',
    '--color-primary-600': '48 110 72',
    '--color-primary-700': '36 83 54',
    '--color-primary-800': '25 60 40',
    '--color-primary-900': '18 43 28',
    '--color-primary-950': '10 25 16',

    /* Secondary */
    '--color-secondary-0': '253 253 253',
    '--color-secondary-50': '251 251 251',
    '--color-secondary-100': '246 246 246',
    '--color-secondary-200': '242 242 242',
    '--color-secondary-300': '237 237 237',
    '--color-secondary-400': '230 230 231',
    '--color-secondary-500': '217 217 219',
    '--color-secondary-600': '198 199 199',
    '--color-secondary-700': '189 189 189',
    '--color-secondary-800': '177 177 177',
    '--color-secondary-900': '165 164 164',
    '--color-secondary-950': '157 157 157',

    /* Tertiary */
    '--color-tertiary-0': '255 250 245',
    '--color-tertiary-50': '255 242 229',
    '--color-tertiary-100': '255 233 213',
    '--color-tertiary-200': '254 209 170',
    '--color-tertiary-300': '253 180 116',
    '--color-tertiary-400': '251 157 75',
    '--color-tertiary-500': '231 129 40',
    '--color-tertiary-600': '215 117 31',
    '--color-tertiary-700': '180 98 26',
    '--color-tertiary-800': '130 73 23',
    '--color-tertiary-900': '108 61 19',
    '--color-tertiary-950': '84 49 18',

    /* Error */
    '--color-error-0': '254 233 233',
    '--color-error-50': '254 226 226',
    '--color-error-100': '254 202 202',
    '--color-error-200': '252 165 165',
    '--color-error-300': '248 113 113',
    '--color-error-400': '239 68 68',
    '--color-error-500': '230 53 53',
    '--color-error-600': '220 38 38',
    '--color-error-700': '185 28 28',
    '--color-error-800': '153 27 27',
    '--color-error-900': '127 29 29',
    '--color-error-950': '83 19 19',

    /* Success */
    '--color-success-0': '228 255 244',
    '--color-success-50': '202 255 232',
    '--color-success-100': '162 241 192',
    '--color-success-200': '132 211 162',
    '--color-success-300': '102 181 132',
    '--color-success-400': '72 151 102',
    '--color-success-500': '52 131 82',
    '--color-success-600': '42 121 72',
    '--color-success-700': '32 111 62',
    '--color-success-800': '22 101 52',
    '--color-success-900': '20 83 45',
    '--color-success-950': '27 50 36',

    /* Warning */
    '--color-warning-0': '255 249 245',
    '--color-warning-50': '255 244 236',
    '--color-warning-100': '255 231 213',
    '--color-warning-200': '254 205 170',
    '--color-warning-300': '253 173 116',
    '--color-warning-400': '251 149 75',
    '--color-warning-500': '231 120 40',
    '--color-warning-600': '215 108 31',
    '--color-warning-700': '180 90 26',
    '--color-warning-800': '130 68 23',
    '--color-warning-900': '108 56 19',
    '--color-warning-950': '84 45 18',

    /* Info */
    '--color-info-0': '236 248 254',
    '--color-info-50': '199 235 252',
    '--color-info-100': '162 221 250',
    '--color-info-200': '124 207 248',
    '--color-info-300': '87 194 246',
    '--color-info-400': '50 180 244',
    '--color-info-500': '13 166 242',
    '--color-info-600': '11 141 205',
    '--color-info-700': '9 115 168',
    '--color-info-800': '7 90 131',
    '--color-info-900': '5 64 93',
    '--color-info-950': '3 38 56',

    /* Typography — dino text scale */
    '--color-typography-0': '255 255 255',
    '--color-typography-50': '245 244 241',
    '--color-typography-100': '229 228 225',
    '--color-typography-200': '209 208 205',
    '--color-typography-300': '168 167 165',
    '--color-typography-400': '156 155 153',
    '--color-typography-500': '156 155 153',  /* text-tertiary #9C9B99 */
    '--color-typography-600': '122 121 119',
    '--color-typography-700': '109 108 106',  /* text-secondary #6D6C6A */
    '--color-typography-800': '64 63 61',
    '--color-typography-900': '38 37 36',
    '--color-typography-950': '26 25 24',     /* text-primary #1A1918 */

    /* Outline */
    '--color-outline-0': '253 254 254',
    '--color-outline-50': '245 244 241',
    '--color-outline-100': '229 228 225',     /* border #E5E4E1 */
    '--color-outline-200': '209 208 205',     /* border-strong #D1D0CD */
    '--color-outline-300': '168 167 165',
    '--color-outline-400': '140 141 141',
    '--color-outline-500': '115 116 116',
    '--color-outline-600': '83 82 82',
    '--color-outline-700': '65 65 65',
    '--color-outline-800': '39 38 36',
    '--color-outline-900': '26 23 23',
    '--color-outline-950': '10 10 10',

    /* Background — dino palette */
    '--color-background-0': '255 255 255',    /* card-bg #FFFFFF */
    '--color-background-50': '245 244 241',   /* bg #F5F4F1 */
    '--color-background-100': '237 236 233',
    '--color-background-200': '229 228 225',  /* border #E5E4E1 */
    '--color-background-300': '209 208 205',  /* border-strong #D1D0CD */
    '--color-background-400': '168 167 165',
    '--color-background-500': '142 142 142',
    '--color-background-600': '116 116 116',
    '--color-background-700': '83 82 82',
    '--color-background-800': '65 64 64',
    '--color-background-900': '39 38 37',
    '--color-background-950': '26 25 24',

    /* Background Special */
    '--color-background-error': '254 241 241',
    '--color-background-warning': '255 243 234',
    '--color-background-success': '237 252 242',
    '--color-background-muted': '245 244 241',
    '--color-background-info': '235 248 254',

    /* Focus Ring Indicator */
    '--color-indicator-primary': '61 138 90',   /* accent-green */
    '--color-indicator-info': '83 153 236',
    '--color-indicator-error': '185 28 28',

    /* Dino Custom Tokens */
    '--color-dino-mint': '184 232 208',          /* #B8E8D0 */
    '--color-dino-mint-light': '232 248 240',    /* #E8F8F0 */
    '--color-dino-accent-green': '61 138 90',   /* #3D8A5A */
    '--color-dino-accent-orange': '232 160 84', /* #E8A054 */
    '--color-dino-accent-coral': '216 149 117', /* #D89575 */
    '--color-dino-bg': '245 244 241',            /* #F5F4F1 */
    '--color-dino-card-bg': '255 255 255',       /* #FFFFFF */
    '--color-dino-border': '229 228 225',        /* #E5E4E1 */
    '--color-dino-border-strong': '209 208 205', /* #D1D0CD */
    '--color-dino-text-primary': '26 25 24',     /* #1A1918 */
    '--color-dino-text-secondary': '109 108 106', /* #6D6C6A */
    '--color-dino-text-tertiary': '156 155 153', /* #9C9B99 */
    '--color-dino-tab-inactive': '168 167 165',  /* #A8A7A5 */
  }),
  dark: vars({
    /* Primary — accent-green (inverted for dark) */
    '--color-primary-0': '10 25 16',
    '--color-primary-50': '18 43 28',
    '--color-primary-100': '25 60 40',
    '--color-primary-200': '36 83 54',
    '--color-primary-300': '48 110 72',
    '--color-primary-400': '61 138 90',
    '--color-primary-500': '80 160 112',
    '--color-primary-600': '110 185 145',
    '--color-primary-700': '150 210 179',
    '--color-primary-800': '184 232 208',
    '--color-primary-900': '220 243 231',
    '--color-primary-950': '240 249 244',

    /* Secondary */
    '--color-secondary-0': '20 20 20',
    '--color-secondary-50': '23 23 23',
    '--color-secondary-100': '31 31 31',
    '--color-secondary-200': '39 39 39',
    '--color-secondary-300': '44 44 44',
    '--color-secondary-400': '56 57 57',
    '--color-secondary-500': '63 64 64',
    '--color-secondary-600': '86 86 86',
    '--color-secondary-700': '110 110 110',
    '--color-secondary-800': '135 135 135',
    '--color-secondary-900': '150 150 150',
    '--color-secondary-950': '164 164 164',

    /* Tertiary */
    '--color-tertiary-0': '84 49 18',
    '--color-tertiary-50': '108 61 19',
    '--color-tertiary-100': '130 73 23',
    '--color-tertiary-200': '180 98 26',
    '--color-tertiary-300': '215 117 31',
    '--color-tertiary-400': '231 129 40',
    '--color-tertiary-500': '251 157 75',
    '--color-tertiary-600': '253 180 116',
    '--color-tertiary-700': '254 209 170',
    '--color-tertiary-800': '255 233 213',
    '--color-tertiary-900': '255 242 229',
    '--color-tertiary-950': '255 250 245',

    /* Error */
    '--color-error-0': '83 19 19',
    '--color-error-50': '127 29 29',
    '--color-error-100': '153 27 27',
    '--color-error-200': '185 28 28',
    '--color-error-300': '220 38 38',
    '--color-error-400': '230 53 53',
    '--color-error-500': '239 68 68',
    '--color-error-600': '249 97 96',
    '--color-error-700': '229 91 90',
    '--color-error-800': '254 202 202',
    '--color-error-900': '254 226 226',
    '--color-error-950': '254 233 233',

    /* Success */
    '--color-success-0': '27 50 36',
    '--color-success-50': '20 83 45',
    '--color-success-100': '22 101 52',
    '--color-success-200': '32 111 62',
    '--color-success-300': '42 121 72',
    '--color-success-400': '52 131 82',
    '--color-success-500': '72 151 102',
    '--color-success-600': '102 181 132',
    '--color-success-700': '132 211 162',
    '--color-success-800': '162 241 192',
    '--color-success-900': '202 255 232',
    '--color-success-950': '228 255 244',

    /* Warning */
    '--color-warning-0': '84 45 18',
    '--color-warning-50': '108 56 19',
    '--color-warning-100': '130 68 23',
    '--color-warning-200': '180 90 26',
    '--color-warning-300': '215 108 31',
    '--color-warning-400': '231 120 40',
    '--color-warning-500': '251 149 75',
    '--color-warning-600': '253 173 116',
    '--color-warning-700': '254 205 170',
    '--color-warning-800': '255 231 213',
    '--color-warning-900': '255 244 237',
    '--color-warning-950': '255 249 245',

    /* Info */
    '--color-info-0': '3 38 56',
    '--color-info-50': '5 64 93',
    '--color-info-100': '7 90 131',
    '--color-info-200': '9 115 168',
    '--color-info-300': '11 141 205',
    '--color-info-400': '13 166 242',
    '--color-info-500': '50 180 244',
    '--color-info-600': '87 194 246',
    '--color-info-700': '124 207 248',
    '--color-info-800': '162 221 250',
    '--color-info-900': '199 235 252',
    '--color-info-950': '236 248 254',

    /* Typography — dark mode */
    '--color-typography-0': '26 25 24',
    '--color-typography-50': '38 37 36',
    '--color-typography-100': '64 63 61',
    '--color-typography-200': '109 108 106',
    '--color-typography-300': '122 121 119',
    '--color-typography-400': '140 140 140',
    '--color-typography-500': '156 155 153',
    '--color-typography-600': '184 183 181',
    '--color-typography-700': '200 199 197',
    '--color-typography-800': '220 219 217',
    '--color-typography-900': '237 236 234',
    '--color-typography-950': '245 244 241',

    /* Outline */
    '--color-outline-0': '26 23 23',
    '--color-outline-50': '39 38 36',
    '--color-outline-100': '65 65 65',
    '--color-outline-200': '83 82 82',
    '--color-outline-300': '115 116 116',
    '--color-outline-400': '140 141 141',
    '--color-outline-500': '165 163 163',
    '--color-outline-600': '211 211 211',
    '--color-outline-700': '221 220 219',
    '--color-outline-800': '230 230 230',
    '--color-outline-900': '243 243 243',
    '--color-outline-950': '253 254 254',

    /* Background — dark mode */
    '--color-background-0': '30 29 27',       /* dark card-bg */
    '--color-background-50': '22 21 19',      /* dark bg */
    '--color-background-100': '42 41 39',
    '--color-background-200': '58 57 55',
    '--color-background-300': '80 79 77',
    '--color-background-400': '100 99 97',
    '--color-background-500': '130 129 127',
    '--color-background-600': '160 159 157',
    '--color-background-700': '200 199 197',
    '--color-background-800': '220 219 217',
    '--color-background-900': '237 236 234',
    '--color-background-950': '245 244 241',

    /* Background Special */
    '--color-background-error': '66 43 43',
    '--color-background-warning': '65 47 35',
    '--color-background-success': '28 43 33',
    '--color-background-muted': '42 41 39',
    '--color-background-info': '26 40 46',

    /* Focus Ring Indicator */
    '--color-indicator-primary': '80 160 112',
    '--color-indicator-info': '161 199 245',
    '--color-indicator-error': '232 70 69',

    /* Dino Custom Tokens — dark mode */
    '--color-dino-mint': '80 160 112',
    '--color-dino-mint-light': '36 83 54',
    '--color-dino-accent-green': '80 160 112',
    '--color-dino-accent-orange': '232 160 84',
    '--color-dino-accent-coral': '216 149 117',
    '--color-dino-bg': '22 21 19',
    '--color-dino-card-bg': '30 29 27',
    '--color-dino-border': '58 57 55',
    '--color-dino-border-strong': '80 79 77',
    '--color-dino-text-primary': '245 244 241',
    '--color-dino-text-secondary': '184 183 181',
    '--color-dino-text-tertiary': '122 121 119',
    '--color-dino-tab-inactive': '100 99 97',
  }),
};
