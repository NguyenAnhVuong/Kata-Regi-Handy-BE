SET check_function_bodies = false;
CREATE TYPE public.orders_status_enum AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'SERVED',
    'SHIPPING',
    'DELIVERED',
    'COMPLETED',
    'CANCEL'
);
CREATE TYPE public.tables_status_enum AS ENUM (
    'OPEN',
    'INUSE',
    'BOOKED',
    'GROUPED'
);
CREATE TYPE public."userDetails_gender_enum" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
);
CREATE TYPE public.users_role_enum AS ENUM (
    'SYSTEM',
    'RESTAURANT_ADMIN',
    'RESTAURANT_STAFF',
    'USER'
);
CREATE TABLE public.images (
    id integer NOT NULL,
    "restaurantId" integer,
    "menuId" integer,
    url character varying(255) NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;
CREATE TABLE public."menuCategories" (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public."menuCategories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."menuCategories_id_seq" OWNED BY public."menuCategories".id;
CREATE TABLE public.menus (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    price integer NOT NULL,
    description text,
    avatar character varying(250) DEFAULT 'undefined/menu-default.png'::character varying NOT NULL,
    "isDisplay" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "restaurantId" integer NOT NULL,
    "creatorId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.menus_id_seq OWNED BY public.menus.id;
CREATE TABLE public."orderItems" (
    id integer NOT NULL,
    "orderId" integer NOT NULL,
    "menuId" integer NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    price integer NOT NULL
);
CREATE SEQUENCE public."orderItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."orderItems_id_seq" OWNED BY public."orderItems".id;
CREATE TABLE public.orders (
    id integer NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    status public.orders_status_enum DEFAULT 'PENDING'::public.orders_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "tableId" integer NOT NULL
);
CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
CREATE TABLE public.restaurants (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    address character varying(500) NOT NULL,
    phone character varying(20) NOT NULL,
    description text,
    avatar character varying(250) DEFAULT 'undefined/restaurant-default.png'::character varying NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "creatorId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.restaurants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.restaurants_id_seq OWNED BY public.restaurants.id;
CREATE TABLE public.tables (
    id integer NOT NULL,
    name character varying(20) NOT NULL,
    "restaurantId" integer NOT NULL,
    status public.tables_status_enum DEFAULT 'OPEN'::public.tables_status_enum NOT NULL,
    "amountOfPeople" integer NOT NULL,
    "openAt" timestamp without time zone
);
CREATE SEQUENCE public.tables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.tables_id_seq OWNED BY public.tables.id;
CREATE TABLE public."userDetails" (
    id integer NOT NULL,
    avatar character varying(250) DEFAULT 'http://localhost:3008/avatar-default.png'::character varying NOT NULL,
    name character varying(500) NOT NULL,
    phone character varying(20),
    birthday character varying(100) NOT NULL,
    address character varying(500),
    gender public."userDetails_gender_enum" DEFAULT 'OTHER'::public."userDetails_gender_enum" NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public."userDetails_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."userDetails_id_seq" OWNED BY public."userDetails".id;
CREATE TABLE public.users (
    id integer NOT NULL,
    "restaurantId" integer,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    role public.users_role_enum DEFAULT 'USER'::public.users_role_enum NOT NULL,
    "refreshToken" text,
    "userDetailId" integer,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
CREATE TABLE public."vocherItems" (
    id integer NOT NULL,
    "vocherId" integer NOT NULL,
    "menuId" integer NOT NULL,
    "maxQuantity" integer,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public."vocherItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."vocherItems_id_seq" OWNED BY public."vocherItems".id;
CREATE TABLE public.vochers (
    id integer NOT NULL,
    code character varying NOT NULL,
    discount integer NOT NULL,
    "discountAmount" integer,
    "maxDiscountAmount" integer,
    "isUsed" boolean DEFAULT false NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "expiredAt" timestamp without time zone NOT NULL,
    description character varying,
    "restaurantId" integer NOT NULL,
    "userId" integer,
    "appliesToAll" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.vochers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.vochers_id_seq OWNED BY public.vochers.id;
ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);
ALTER TABLE ONLY public."menuCategories" ALTER COLUMN id SET DEFAULT nextval('public."menuCategories_id_seq"'::regclass);
ALTER TABLE ONLY public.menus ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);
ALTER TABLE ONLY public."orderItems" ALTER COLUMN id SET DEFAULT nextval('public."orderItems_id_seq"'::regclass);
ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
ALTER TABLE ONLY public.restaurants ALTER COLUMN id SET DEFAULT nextval('public.restaurants_id_seq'::regclass);
ALTER TABLE ONLY public.tables ALTER COLUMN id SET DEFAULT nextval('public.tables_id_seq'::regclass);
ALTER TABLE ONLY public."userDetails" ALTER COLUMN id SET DEFAULT nextval('public."userDetails_id_seq"'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public."vocherItems" ALTER COLUMN id SET DEFAULT nextval('public."vocherItems_id_seq"'::regclass);
ALTER TABLE ONLY public.vochers ALTER COLUMN id SET DEFAULT nextval('public.vochers_id_seq'::regclass);
ALTER TABLE ONLY public.vochers
    ADD CONSTRAINT "PK_15b7bea7573d99ca0603d8080de" PRIMARY KEY (id);
ALTER TABLE ONLY public.images
    ADD CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY (id);
ALTER TABLE ONLY public."userDetails"
    ADD CONSTRAINT "PK_35f9ec44d0772d64d68f5417c6b" PRIMARY KEY (id);
ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY (id);
ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id);
ALTER TABLE ONLY public.tables
    ADD CONSTRAINT "PK_7cf2aca7af9550742f855d4eb69" PRIMARY KEY (id);
ALTER TABLE ONLY public."menuCategories"
    ADD CONSTRAINT "PK_82ec7c5d09976f99c105237026d" PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);
ALTER TABLE ONLY public."orderItems"
    ADD CONSTRAINT "PK_b1b864ba2b7d5762d34265cc8b8" PRIMARY KEY (id);
ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT "PK_e2133a72eb1cc8f588f7b503e68" PRIMARY KEY (id);
ALTER TABLE ONLY public."vocherItems"
    ADD CONSTRAINT "PK_f4958b5e57c1e39d50634a2653d" PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);
ALTER TABLE ONLY public.vochers
    ADD CONSTRAINT "FK_0ad7d3499c60c581f01435c7c15" FOREIGN KEY ("restaurantId") REFERENCES public.restaurants(id);
ALTER TABLE ONLY public.vochers
    ADD CONSTRAINT "FK_27ea1c9d265f150d30766a78e6a" FOREIGN KEY ("userId") REFERENCES public.users(id);
ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_2a7fdd7af437285a3ef0fc8b64f" FOREIGN KEY ("tableId") REFERENCES public.tables(id);
ALTER TABLE ONLY public.images
    ADD CONSTRAINT "FK_34aa26404e1119206422a634c82" FOREIGN KEY ("restaurantId") REFERENCES public.restaurants(id);
ALTER TABLE ONLY public."orderItems"
    ADD CONSTRAINT "FK_391c9e5d5af8d7d7ce4b96db80e" FOREIGN KEY ("orderId") REFERENCES public.orders(id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_4ca7f2f579cda8a6158c7fc1650" FOREIGN KEY ("restaurantId") REFERENCES public.restaurants(id);
ALTER TABLE ONLY public."vocherItems"
    ADD CONSTRAINT "FK_523cb75c4efaa4965b82f227d76" FOREIGN KEY ("vocherId") REFERENCES public.vochers(id);
ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "FK_62f6422b138b02c889426a1bf47" FOREIGN KEY ("restaurantId") REFERENCES public.restaurants(id);
ALTER TABLE ONLY public.images
    ADD CONSTRAINT "FK_8028b507fada0de6b0e439830de" FOREIGN KEY ("menuId") REFERENCES public.menus(id);
ALTER TABLE ONLY public.tables
    ADD CONSTRAINT "FK_94e0a6541322cecd437cd841701" FOREIGN KEY ("restaurantId") REFERENCES public.restaurants(id);
ALTER TABLE ONLY public."vocherItems"
    ADD CONSTRAINT "FK_c8b6b2c49fe253bb128412879ad" FOREIGN KEY ("menuId") REFERENCES public.menus(id);
ALTER TABLE ONLY public."orderItems"
    ADD CONSTRAINT "FK_f8f56375e15e17f878b5784ee03" FOREIGN KEY ("menuId") REFERENCES public.menus(id);
