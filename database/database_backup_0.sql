--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

-- Started on 2025-04-29 11:39:35

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 143914)
-- Name: bỘ_phẬn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."bỘ_phẬn" (
    "id_bộ_phận" character varying(50) NOT NULL,
    "tên_bộ_phận" character varying(100) NOT NULL
);


ALTER TABLE public."bỘ_phẬn" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 143971)
-- Name: chi_tiẾt_hoÁ_ĐƠn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."chi_tiẾt_hoÁ_ĐƠn" (
    "id_chi_tiết" character varying(50) NOT NULL,
    "id_hoá_đơn" character varying(50),
    "id_dịch_vụ" character varying(50),
    "số_lượng" integer NOT NULL,
    "giá_tại_thời_điểm" integer NOT NULL,
    "thành_tiền" integer NOT NULL
);


ALTER TABLE public."chi_tiẾt_hoÁ_ĐƠn" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 143939)
-- Name: dỊch_vỤ; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dỊch_vỤ" (
    "id_dịch_vụ" character varying(50) NOT NULL,
    "tên_dịch_vụ" character varying(100) NOT NULL,
    "giá" integer NOT NULL,
    "trạng_thái" character varying(50) NOT NULL
);


ALTER TABLE public."dỊch_vỤ" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 143960)
-- Name: hoÁ_ĐƠn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."hoÁ_ĐƠn" (
    "id_hoá_đơn" character varying(50) NOT NULL,
    "id_hộ" character varying(50),
    "số_tiền" integer NOT NULL,
    "tháng_năm" date NOT NULL,
    "ngày_tạo" date NOT NULL,
    "trạng_thái" character varying(50),
    CONSTRAINT "hoÁ_ĐƠn_trạng_thái_check" CHECK ((("trạng_thái")::text = ANY ((ARRAY['chưa thanh toán'::character varying, 'đã thanh toán'::character varying])::text[])))
);


ALTER TABLE public."hoÁ_ĐƠn" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 143902)
-- Name: hỘ_cƯ_dÂn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."hỘ_cƯ_dÂn" (
    "id_hộ" character varying(50) NOT NULL,
    "id_tài_khoản" character varying(50),
    "số_phòng" integer NOT NULL,
    "tên_đại_diện" character varying(100) NOT NULL,
    "sđt_đại_diện" character varying(15) NOT NULL,
    "số_thành_viên" integer NOT NULL
);


ALTER TABLE public."hỘ_cƯ_dÂn" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 144002)
-- Name: nhiỆm_vỤ; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."nhiỆm_vỤ" (
    "id_nhiệm_vụ" character varying(50) NOT NULL,
    "tên_nhiệm_vụ" character varying(100) NOT NULL,
    "mô_tả" text,
    "id_người_giao" character varying(50),
    "id_người_nhận" character varying(50),
    "hạn_hoàn_thành" date NOT NULL
);


ALTER TABLE public."nhiỆm_vỤ" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 143919)
-- Name: nhÂn_viÊn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."nhÂn_viÊn" (
    "id_nhân_viên" character varying(50) NOT NULL,
    "tên_nhân_viên" character varying(100) NOT NULL,
    "id_bộ_phận" character varying(50),
    "id_tài_khoản" character varying(50),
    "ngày_bắt_đầu" date NOT NULL,
    "chức_vụ" character varying(50),
    "trạng_thái" character varying(50) NOT NULL,
    "số_điện_thoại" character varying(15) NOT NULL,
    "địa_chỉ" character varying(200) NOT NULL,
    CONSTRAINT "nhÂn_viÊn_chức_vụ_check" CHECK ((("chức_vụ")::text = ANY ((ARRAY['nhân viên'::character varying, 'trưởng bộ phận'::character varying])::text[])))
);


ALTER TABLE public."nhÂn_viÊn" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 144019)
-- Name: sỰ_cỐ; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."sỰ_cỐ" (
    "id_sự_cố" character varying(50) NOT NULL,
    "tên_sự_cố" character varying(100) NOT NULL,
    "loại_sự_cố" character varying(50),
    "thời_gian_báo_cáo" date NOT NULL,
    "id_người_báo_cáo" character varying(50),
    "id_người_trách_nhiệm" character varying(50),
    "mô_tả" text,
    "trạng_thái" character varying(50) NOT NULL,
    CONSTRAINT "sỰ_cỐ_loại_sự_cố_check" CHECK ((("loại_sự_cố")::text = ANY ((ARRAY['Bộ phận Lễ Tân'::character varying, 'Bộ phận Kế toán'::character varying, 'Bộ phận Vệ sinh'::character varying, 'Bộ phận Kỹ thuật'::character varying, 'Bộ phận Bảo vệ'::character varying])::text[])))
);


ALTER TABLE public."sỰ_cỐ" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 143986)
-- Name: thanh_toÁn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."thanh_toÁn" (
    "id_thanh_toán" character varying(50) NOT NULL,
    "id_hoá_đơn" character varying(50),
    "số_tiền" integer NOT NULL,
    "ngày_thanh_toán" date NOT NULL,
    "phương_thức" character varying(50),
    "id_người_xác_nhận" character varying(50),
    CONSTRAINT "thanh_toÁn_phương_thức_check" CHECK ((("phương_thức")::text = ANY ((ARRAY['tiền mặt'::character varying, 'chuyển khoản'::character varying])::text[])))
);


ALTER TABLE public."thanh_toÁn" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 144037)
-- Name: thÔng_bÁo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."thÔng_bÁo" (
    "id_thông_báo" character varying(50) NOT NULL,
    "id_thanh_toán" character varying(50),
    "id_hộ" character varying(50),
    "nội_dung" text NOT NULL
);


ALTER TABLE public."thÔng_bÁo" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 143897)
-- Name: tÀi_khoẢn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."tÀi_khoẢn" (
    "id_tài_khoản" character varying(50) NOT NULL,
    "tên_người_dùng" character varying(100) NOT NULL,
    "mật_khẩu" character varying(100) NOT NULL
);


ALTER TABLE public."tÀi_khoẢn" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 143944)
-- Name: ĐĂng_kÝ_dỊch_vỤ; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ĐĂng_kÝ_dỊch_vỤ" (
    "id_đăng_ký" character varying(50) NOT NULL,
    "id_hộ" character varying(50),
    "id_dịch_vụ" character varying(50),
    "ngày_bắt_đầu" date NOT NULL,
    "trạng_thái" character varying(50),
    CONSTRAINT "ĐĂng_kÝ_dỊch_vỤ_trạng_thái_check" CHECK ((("trạng_thái")::text = ANY ((ARRAY['đang dùng'::character varying, 'đã hủy'::character varying])::text[])))
);


ALTER TABLE public."ĐĂng_kÝ_dỊch_vỤ" OWNER TO postgres;

--
-- TOC entry 4871 (class 0 OID 143914)
-- Dependencies: 217
-- Data for Name: bỘ_phẬn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."bỘ_phẬn" ("id_bộ_phận", "tên_bộ_phận") FROM stdin;
BP001	Bộ phận Lễ Tân
BP002	Bộ phận Kế toán
BP003	Bộ phận Vệ sinh
BP004	Bộ phận Kỹ thuật
BP005	Bộ phận Bảo vệ
\.


--
-- TOC entry 4876 (class 0 OID 143971)
-- Dependencies: 222
-- Data for Name: chi_tiẾt_hoÁ_ĐƠn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."chi_tiẾt_hoÁ_ĐƠn" ("id_chi_tiết", "id_hoá_đơn", "id_dịch_vụ", "số_lượng", "giá_tại_thời_điểm", "thành_tiền") FROM stdin;
CT001	HD001	DV001	1	50000	50000
CT002	HD002	DV001	2	50000	100000
CT003	HD004	DV003	1	100000	100000
CT004	HD004	DV004	1	150000	150000
CT005	HD005	DV003	3	100000	300000
CT006	HD006	DV003	1	100000	100000
CT007	HD006	DV004	1	150000	150000
CT008	HD008	DV005	1	0	0
CT009	HD010	DV002	1	200000	200000
CT010	HD012	DV002	1	200000	200000
CT011	HD013	DV003	1	100000	100000
CT012	HD014	DV003	1	100000	100000
CT013	HD014	DV004	1	150000	150000
\.


--
-- TOC entry 4873 (class 0 OID 143939)
-- Dependencies: 219
-- Data for Name: dỊch_vỤ; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."dỊch_vỤ" ("id_dịch_vụ", "tên_dịch_vụ", "giá", "trạng_thái") FROM stdin;
DV001	Trông xe	50000	đang hoạt động
DV002	Tập gym	200000	đang hoạt động
DV003	Bể bơi	100000	đang hoạt động
DV004	Dọn dẹp	150000	đang hoạt động
DV005	Bảo vệ	0	không hoạt động
\.


--
-- TOC entry 4875 (class 0 OID 143960)
-- Dependencies: 221
-- Data for Name: hoÁ_ĐƠn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."hoÁ_ĐƠn" ("id_hoá_đơn", "id_hộ", "số_tiền", "tháng_năm", "ngày_tạo", "trạng_thái") FROM stdin;
HD001	HD001	50000	2023-01-01	2023-01-05	đã thanh toán
HD002	HD001	200000	2023-02-01	2023-02-10	chưa thanh toán
HD003	HD001	0	2023-03-01	2023-03-15	đã thanh toán
HD004	HD002	250000	2023-01-01	2023-01-07	đã thanh toán
HD005	HD002	100000	2023-02-01	2023-02-12	chưa thanh toán
HD006	HD002	150000	2023-03-01	2023-03-20	đã thanh toán
HD007	HD003	0	2023-01-01	2023-01-10	chưa thanh toán
HD008	HD003	50000	2023-02-01	2023-02-15	đã thanh toán
HD009	HD003	0	2023-03-01	2023-03-25	chưa thanh toán
HD010	HD004	200000	2023-01-01	2023-01-08	đã thanh toán
HD011	HD004	0	2023-02-01	2023-02-20	chưa thanh toán
HD012	HD004	200000	2023-03-01	2023-03-18	đã thanh toán
HD013	HD005	100000	2023-01-01	2023-01-12	đã thanh toán
HD014	HD005	150000	2023-02-01	2023-02-25	chưa thanh toán
HD015	HD005	0	2023-03-01	2023-03-30	đã thanh toán
\.


--
-- TOC entry 4870 (class 0 OID 143902)
-- Dependencies: 216
-- Data for Name: hỘ_cƯ_dÂn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."hỘ_cƯ_dÂn" ("id_hộ", "id_tài_khoản", "số_phòng", "tên_đại_diện", "sđt_đại_diện", "số_thành_viên") FROM stdin;
HD001	TK001	101	Nguyễn Văn A	0912345678	3
HD002	TK002	205	Trần Thị B	0987654321	2
HD003	TK003	310	Lê Văn C	0933445566	4
HD004	TK004	415	Phạm Thị D	0909123456	1
HD005	TK005	520	Hoàng Văn E	0977889900	5
\.


--
-- TOC entry 4878 (class 0 OID 144002)
-- Dependencies: 224
-- Data for Name: nhiỆm_vỤ; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."nhiỆm_vỤ" ("id_nhiệm_vụ", "tên_nhiệm_vụ", "mô_tả", "id_người_giao", "id_người_nhận", "hạn_hoàn_thành") FROM stdin;
NVU001	Kiểm tra hệ thống điện	Kiểm tra toàn bộ hệ thống điện tòa nhà	NV001	NV004	2023-12-01
NVU002	Dọn dẹp sảnh chính	Dọn dẹp và lau chùi sảnh chính	NV003	NV006	2023-11-25
NVU003	Xử lý hóa đơn tháng 10	Kiểm tra và in hóa đơn	NV002	NV009	2023-11-20
NVU004	Sửa chữa bể bơi	Khắc phục sự cố rò rỉ nước	NV004	NV008	2023-12-05
NVU005	Tuần tra khu vực tầng 5	Kiểm tra an ninh tầng 5	NV005	NV010	2023-11-30
NVU006	Tiếp nhận phản ánh	Ghi nhận ý kiến cư dân	NV001	NV007	2023-11-28
NVU007	Kiểm tra thiết bị gym	Bảo trì máy chạy bộ	NV004	NV008	2023-12-10
NVU008	Lập báo cáo tài chính	Tổng hợp chi phí tháng 11	NV002	NV009	2023-11-22
NVU009	Vệ sinh khu vực bãi xe	Dọn dẹp bãi đỗ xe	NV003	NV006	2023-11-27
NVU010	Hỗ trợ sự kiện cư dân	Chuẩn bị hội trường	NV001	NV007	2023-12-15
\.


--
-- TOC entry 4872 (class 0 OID 143919)
-- Dependencies: 218
-- Data for Name: nhÂn_viÊn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."nhÂn_viÊn" ("id_nhân_viên", "tên_nhân_viên", "id_bộ_phận", "id_tài_khoản", "ngày_bắt_đầu", "chức_vụ", "trạng_thái", "số_điện_thoại", "địa_chỉ") FROM stdin;
NV001	Nguyễn Thị F	BP001	TK006	2020-05-15	trưởng bộ phận	đang làm việc	0911223344	123 Đường Láng, Hà Nội
NV002	Trần Văn G	BP002	TK007	2021-03-20	trưởng bộ phận	đang làm việc	0988112233	456 Lê Lợi, TP.HCM
NV003	Lê Thị H	BP003	TK008	2022-01-10	trưởng bộ phận	đang làm việc	0933445577	789 Nguyễn Trãi, Đà Nẵng
NV004	Phạm Văn I	BP004	TK009	2020-11-05	trưởng bộ phận	đang làm việc	0909556677	101 Trần Phú, Huế
NV005	Hoàng Thị K	BP005	TK010	2021-07-25	trưởng bộ phận	đang làm việc	0977881122	321 Hai Bà Trưng, Hà Nội
NV006	Nguyễn Văn L	BP003	TK011	2023-02-15	nhân viên	đang làm việc	0912334455	654 Đường Láng, Hà Nội
NV007	Trần Thị M	BP001	TK012	2022-09-10	nhân viên	đang làm việc	0988223344	987 Lê Lợi, TP.HCM
NV008	Lê Văn N	BP004	TK013	2023-04-20	nhân viên	đang làm việc	0933556677	147 Nguyễn Trãi, Đà Nẵng
NV009	Phạm Thị O	BP002	TK014	2021-12-01	nhân viên	đang làm việc	0909667788	258 Trần Phú, Huế
NV010	Hoàng Văn P	BP005	TK015	2022-06-30	nhân viên	đang làm việc	0977990011	369 Hai Bà Trưng, Hà Nội
\.


--
-- TOC entry 4879 (class 0 OID 144019)
-- Dependencies: 225
-- Data for Name: sỰ_cỐ; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."sỰ_cỐ" ("id_sự_cố", "tên_sự_cố", "loại_sự_cố", "thời_gian_báo_cáo", "id_người_báo_cáo", "id_người_trách_nhiệm", "mô_tả", "trạng_thái") FROM stdin;
SC001	Mất điện tầng 3	Bộ phận Kỹ thuật	2023-01-15	NV001	NV004	Mất điện đột ngột tại tầng 3	đã giải quyết
SC002	Rò rỉ nước bể bơi	Bộ phận Kỹ thuật	2023-02-10	NV007	NV008	Bể bơi bị rò rỉ nước	đang xử lý
SC003	Hỏng máy tập gym	Bộ phận Kỹ thuật	2023-03-05	NV009	NV004	Máy chạy bộ không hoạt động	đã giải quyết
SC004	Kẹt thang máy	Bộ phận Kỹ thuật	2023-04-20	NV002	NV008	Thang máy bị kẹt tại tầng 2	đang xử lý
SC005	Khu vực bãi xe bẩn	Bộ phận Vệ sinh	2023-05-12	NV005	NV006	Bãi xe ngập rác	đã giải quyết
\.


--
-- TOC entry 4877 (class 0 OID 143986)
-- Dependencies: 223
-- Data for Name: thanh_toÁn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."thanh_toÁn" ("id_thanh_toán", "id_hoá_đơn", "số_tiền", "ngày_thanh_toán", "phương_thức", "id_người_xác_nhận") FROM stdin;
TT001	HD001	50000	2023-01-10	tiền mặt	NV001
TT002	HD003	0	2023-03-20	chuyển khoản	NV002
TT003	HD004	250000	2023-01-15	tiền mặt	NV003
TT004	HD006	150000	2023-03-25	chuyển khoản	NV004
TT005	HD008	50000	2023-02-20	tiền mặt	NV005
TT006	HD010	200000	2023-01-15	chuyển khoản	NV006
TT007	HD012	200000	2023-03-25	tiền mặt	NV007
TT008	HD013	100000	2023-01-20	chuyển khoản	NV008
TT009	HD015	0	2023-03-31	tiền mặt	NV009
\.


--
-- TOC entry 4880 (class 0 OID 144037)
-- Dependencies: 226
-- Data for Name: thÔng_bÁo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."thÔng_bÁo" ("id_thông_báo", "id_thanh_toán", "id_hộ", "nội_dung") FROM stdin;
TB001	TT001	HD001	Hoá đơn HD001 đã được thanh toán vào ngày 2023-01-10 với số tiền 50000 VND.
TB002	TT002	HD001	Hoá đơn HD003 đã được thanh toán vào ngày 2023-03-20 với số tiền 0 VND.
TB003	TT003	HD002	Hoá đơn HD004 đã được thanh toán vào ngày 2023-01-15 với số tiền 250000 VND.
TB004	TT004	HD002	Hoá đơn HD006 đã được thanh toán vào ngày 2023-03-25 với số tiền 150000 VND.
TB005	TT005	HD003	Hoá đơn HD008 đã được thanh toán vào ngày 2023-02-20 với số tiền 50000 VND.
TB006	TT006	HD004	Hoá đơn HD010 đã được thanh toán vào ngày 2023-01-15 với số tiền 200000 VND.
TB007	TT007	HD004	Hoá đơn HD012 đã được thanh toán vào ngày 2023-03-25 với số tiền 200000 VND.
TB008	TT008	HD005	Hoá đơn HD013 đã được thanh toán vào ngày 2023-01-20 với số tiền 100000 VND.
TB009	TT009	HD005	Hoá đơn HD015 đã được thanh toán vào ngày 2023-03-31 với số tiền 0 VND.
\.


--
-- TOC entry 4869 (class 0 OID 143897)
-- Dependencies: 215
-- Data for Name: tÀi_khoẢn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."tÀi_khoẢn" ("id_tài_khoản", "tên_người_dùng", "mật_khẩu") FROM stdin;
TK001	nguyenvana  abc123xyz
TK002	tranthib    pass456word
TK003	levanc  secure789pass
TK004	phamthid    mysecret101
TK005	hoangvane   password2023
TK006	nguyenthif  head123pass
TK007	tranvang    account456
TK008	lethih  clean789xyz
TK009	phamvani    tech101pass
TK010	hoangthik   guard2023
TK011	nguyenvanl  staff111pass
TK012	tranthim    staff222xyz
TK013	levann  staff333abc
TK014	phamthio    staff444def
TK015	hoangvanp   staff555ghi
\.


--
-- TOC entry 4874 (class 0 OID 143944)
-- Dependencies: 220
-- Data for Name: ĐĂng_kÝ_dỊch_vỤ; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ĐĂng_kÝ_dỊch_vỤ" ("id_đăng_ký", "id_hộ", "id_dịch_vụ", "ngày_bắt_đầu", "trạng_thái") FROM stdin;
DK001	HD001	DV001	2023-01-15	đang dùng
DK002	HD001	DV002	2023-02-10	đã hủy
DK003	HD002	DV003	2023-03-01	đang dùng
DK004	HD002	DV004	2023-01-20	đang dùng
DK005	HD003	DV001	2023-02-25	đã hủy
DK006	HD003	DV005	2023-03-10	đang dùng
DK007	HD004	DV002	2023-01-05	đang dùng
DK008	HD005	DV003	2023-02-15	đang dùng
DK009	HD005	DV004	2023-03-20	đã hủy
DK010	HD005	DV005	2023-01-25	đang dùng
\.


--
-- TOC entry 4689 (class 2606 OID 143918)
-- Name: bỘ_phẬn bỘ_phẬn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."bỘ_phẬn"
    ADD CONSTRAINT "bỘ_phẬn_pkey" PRIMARY KEY ("id_bộ_phận");


--
-- TOC entry 4701 (class 2606 OID 143975)
-- Name: chi_tiẾt_hoÁ_ĐƠn chi_tiẾt_hoÁ_ĐƠn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chi_tiẾt_hoÁ_ĐƠn"
    ADD CONSTRAINT "chi_tiẾt_hoÁ_ĐƠn_pkey" PRIMARY KEY ("id_chi_tiết");


--
-- TOC entry 4695 (class 2606 OID 143943)
-- Name: dỊch_vỤ dỊch_vỤ_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dỊch_vỤ"
    ADD CONSTRAINT "dỊch_vỤ_pkey" PRIMARY KEY ("id_dịch_vụ");


--
-- TOC entry 4699 (class 2606 OID 143965)
-- Name: hoÁ_ĐƠn hoÁ_ĐƠn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hoÁ_ĐƠn"
    ADD CONSTRAINT "hoÁ_ĐƠn_pkey" PRIMARY KEY ("id_hoá_đơn");


--
-- TOC entry 4685 (class 2606 OID 143908)
-- Name: hỘ_cƯ_dÂn hỘ_cƯ_dÂn_id_tài_khoản_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hỘ_cƯ_dÂn"
    ADD CONSTRAINT "hỘ_cƯ_dÂn_id_tài_khoản_key" UNIQUE ("id_tài_khoản");


--
-- TOC entry 4687 (class 2606 OID 143906)
-- Name: hỘ_cƯ_dÂn hỘ_cƯ_dÂn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hỘ_cƯ_dÂn"
    ADD CONSTRAINT "hỘ_cƯ_dÂn_pkey" PRIMARY KEY ("id_hộ");


--
-- TOC entry 4705 (class 2606 OID 144008)
-- Name: nhiỆm_vỤ nhiỆm_vỤ_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."nhiỆm_vỤ"
    ADD CONSTRAINT "nhiỆm_vỤ_pkey" PRIMARY KEY ("id_nhiệm_vụ");


--
-- TOC entry 4691 (class 2606 OID 143928)
-- Name: nhÂn_viÊn nhÂn_viÊn_id_tài_khoản_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."nhÂn_viÊn"
    ADD CONSTRAINT "nhÂn_viÊn_id_tài_khoản_key" UNIQUE ("id_tài_khoản");


--
-- TOC entry 4693 (class 2606 OID 143926)
-- Name: nhÂn_viÊn nhÂn_viÊn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."nhÂn_viÊn"
    ADD CONSTRAINT "nhÂn_viÊn_pkey" PRIMARY KEY ("id_nhân_viên");


--
-- TOC entry 4707 (class 2606 OID 144026)
-- Name: sỰ_cỐ sỰ_cỐ_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sỰ_cỐ"
    ADD CONSTRAINT "sỰ_cỐ_pkey" PRIMARY KEY ("id_sự_cố");


--
-- TOC entry 4703 (class 2606 OID 143991)
-- Name: thanh_toÁn thanh_toÁn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."thanh_toÁn"
    ADD CONSTRAINT "thanh_toÁn_pkey" PRIMARY KEY ("id_thanh_toán");


--
-- TOC entry 4709 (class 2606 OID 144043)
-- Name: thÔng_bÁo thÔng_bÁo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."thÔng_bÁo"
    ADD CONSTRAINT "thÔng_bÁo_pkey" PRIMARY KEY ("id_thông_báo");


--
-- TOC entry 4683 (class 2606 OID 143901)
-- Name: tÀi_khoẢn tÀi_khoẢn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tÀi_khoẢn"
    ADD CONSTRAINT "tÀi_khoẢn_pkey" PRIMARY KEY ("id_tài_khoản");


--
-- TOC entry 4697 (class 2606 OID 143949)
-- Name: ĐĂng_kÝ_dỊch_vỤ ĐĂng_kÝ_dỊch_vỤ_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ĐĂng_kÝ_dỊch_vỤ"
    ADD CONSTRAINT "ĐĂng_kÝ_dỊch_vỤ_pkey" PRIMARY KEY ("id_đăng_ký");


--
-- TOC entry 4716 (class 2606 OID 143981)
-- Name: chi_tiẾt_hoÁ_ĐƠn chi_tiẾt_hoÁ_ĐƠn_id_dịch_vụ_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chi_tiẾt_hoÁ_ĐƠn"
    ADD CONSTRAINT "chi_tiẾt_hoÁ_ĐƠn_id_dịch_vụ_fkey" FOREIGN KEY ("id_dịch_vụ") REFERENCES public."dỊch_vỤ"("id_dịch_vụ");


--
-- TOC entry 4717 (class 2606 OID 143976)
-- Name: chi_tiẾt_hoÁ_ĐƠn chi_tiẾt_hoÁ_ĐƠn_id_hoá_đơn_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chi_tiẾt_hoÁ_ĐƠn"
    ADD CONSTRAINT "chi_tiẾt_hoÁ_ĐƠn_id_hoá_đơn_fkey" FOREIGN KEY ("id_hoá_đơn") REFERENCES public."hoÁ_ĐƠn"("id_hoá_đơn");


--
-- TOC entry 4715 (class 2606 OID 143966)
-- Name: hoÁ_ĐƠn hoÁ_ĐƠn_id_hộ_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hoÁ_ĐƠn"
    ADD CONSTRAINT "hoÁ_ĐƠn_id_hộ_fkey" FOREIGN KEY ("id_hộ") REFERENCES public."hỘ_cƯ_dÂn"("id_hộ");


--
-- TOC entry 4710 (class 2606 OID 143909)
-- Name: hỘ_cƯ_dÂn hỘ_cƯ_dÂn_id_tài_khoản_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hỘ_cƯ_dÂn"
    ADD CONSTRAINT "hỘ_cƯ_dÂn_id_tài_khoản_fkey" FOREIGN KEY ("id_tài_khoản") REFERENCES public."tÀi_khoẢn"("id_tài_khoản");


--
-- TOC entry 4720 (class 2606 OID 144009)
-- Name: nhiỆm_vỤ nhiỆm_vỤ_id_người_giao_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."nhiỆm_vỤ"
    ADD CONSTRAINT "nhiỆm_vỤ_id_người_giao_fkey" FOREIGN KEY ("id_người_giao") REFERENCES public."nhÂn_viÊn"("id_nhân_viên");


--
-- TOC entry 4721 (class 2606 OID 144014)
-- Name: nhiỆm_vỤ nhiỆm_vỤ_id_người_nhận_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."nhiỆm_vỤ"
    ADD CONSTRAINT "nhiỆm_vỤ_id_người_nhận_fkey" FOREIGN KEY ("id_người_nhận") REFERENCES public."nhÂn_viÊn"("id_nhân_viên");


--
-- TOC entry 4711 (class 2606 OID 143929)
-- Name: nhÂn_viÊn nhÂn_viÊn_id_bộ_phận_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."nhÂn_viÊn"
    ADD CONSTRAINT "nhÂn_viÊn_id_bộ_phận_fkey" FOREIGN KEY ("id_bộ_phận") REFERENCES public."bỘ_phẬn"("id_bộ_phận");


--
-- TOC entry 4712 (class 2606 OID 143934)
-- Name: nhÂn_viÊn nhÂn_viÊn_id_tài_khoản_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."nhÂn_viÊn"
    ADD CONSTRAINT "nhÂn_viÊn_id_tài_khoản_fkey" FOREIGN KEY ("id_tài_khoản") REFERENCES public."tÀi_khoẢn"("id_tài_khoản");


--
-- TOC entry 4722 (class 2606 OID 144027)
-- Name: sỰ_cỐ sỰ_cỐ_id_người_báo_cáo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sỰ_cỐ"
    ADD CONSTRAINT "sỰ_cỐ_id_người_báo_cáo_fkey" FOREIGN KEY ("id_người_báo_cáo") REFERENCES public."nhÂn_viÊn"("id_nhân_viên");


--
-- TOC entry 4723 (class 2606 OID 144032)
-- Name: sỰ_cỐ sỰ_cỐ_id_người_trách_nhiệm_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."sỰ_cỐ"
    ADD CONSTRAINT "sỰ_cỐ_id_người_trách_nhiệm_fkey" FOREIGN KEY ("id_người_trách_nhiệm") REFERENCES public."nhÂn_viÊn"("id_nhân_viên");


--
-- TOC entry 4718 (class 2606 OID 143992)
-- Name: thanh_toÁn thanh_toÁn_id_hoá_đơn_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."thanh_toÁn"
    ADD CONSTRAINT "thanh_toÁn_id_hoá_đơn_fkey" FOREIGN KEY ("id_hoá_đơn") REFERENCES public."hoÁ_ĐƠn"("id_hoá_đơn");


--
-- TOC entry 4719 (class 2606 OID 143997)
-- Name: thanh_toÁn thanh_toÁn_id_người_xác_nhận_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."thanh_toÁn"
    ADD CONSTRAINT "thanh_toÁn_id_người_xác_nhận_fkey" FOREIGN KEY ("id_người_xác_nhận") REFERENCES public."nhÂn_viÊn"("id_nhân_viên");


--
-- TOC entry 4724 (class 2606 OID 144049)
-- Name: thÔng_bÁo thÔng_bÁo_id_hộ_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."thÔng_bÁo"
    ADD CONSTRAINT "thÔng_bÁo_id_hộ_fkey" FOREIGN KEY ("id_hộ") REFERENCES public."hỘ_cƯ_dÂn"("id_hộ");


--
-- TOC entry 4725 (class 2606 OID 144044)
-- Name: thÔng_bÁo thÔng_bÁo_id_thanh_toán_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."thÔng_bÁo"
    ADD CONSTRAINT "thÔng_bÁo_id_thanh_toán_fkey" FOREIGN KEY ("id_thanh_toán") REFERENCES public."thanh_toÁn"("id_thanh_toán");


--
-- TOC entry 4713 (class 2606 OID 143955)
-- Name: ĐĂng_kÝ_dỊch_vỤ ĐĂng_kÝ_dỊch_vỤ_id_dịch_vụ_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ĐĂng_kÝ_dỊch_vỤ"
    ADD CONSTRAINT "ĐĂng_kÝ_dỊch_vỤ_id_dịch_vụ_fkey" FOREIGN KEY ("id_dịch_vụ") REFERENCES public."dỊch_vỤ"("id_dịch_vụ");


--
-- TOC entry 4714 (class 2606 OID 143950)
-- Name: ĐĂng_kÝ_dỊch_vỤ ĐĂng_kÝ_dỊch_vỤ_id_hộ_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ĐĂng_kÝ_dỊch_vỤ"
    ADD CONSTRAINT "ĐĂng_kÝ_dỊch_vỤ_id_hộ_fkey" FOREIGN KEY ("id_hộ") REFERENCES public."hỘ_cƯ_dÂn"("id_hộ");


-- Completed on 2025-04-29 11:39:35

--
-- PostgreSQL database dump complete
--

