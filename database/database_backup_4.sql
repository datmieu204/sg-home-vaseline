toc.dat                                                                                             0000600 0004000 0002000 00000064122 15005361504 0014443 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP        #                }            pttk1    16.8    16.8 L    >           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         ?           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         @           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         A           1262    145158    pttk1    DATABASE     k   CREATE DATABASE pttk1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'vi-VN';
    DROP DATABASE pttk1;
                postgres    false         X           1247    145166    employee_position    TYPE     a   CREATE TYPE public.employee_position AS ENUM (
    'manager',
    'staff',
    'head_manager'
);
 $   DROP TYPE public.employee_position;
       public          postgres    false         U           1247    145160    employee_status    TYPE     M   CREATE TYPE public.employee_status AS ENUM (
    'active',
    'inactive'
);
 "   DROP TYPE public.employee_status;
       public          postgres    false         m           1247    145212    household_status    TYPE     N   CREATE TYPE public.household_status AS ENUM (
    'active',
    'inactive'
);
 #   DROP TYPE public.household_status;
       public          postgres    false         [           1247    145174    incident_status    TYPE     R   CREATE TYPE public.incident_status AS ENUM (
    'in_progress',
    'resolved'
);
 "   DROP TYPE public.incident_status;
       public          postgres    false         ^           1247    145180    invoice_status    TYPE     I   CREATE TYPE public.invoice_status AS ENUM (
    'paid',
    'overdue'
);
 !   DROP TYPE public.invoice_status;
       public          postgres    false         a           1247    145186    payment_method    TYPE     F   CREATE TYPE public.payment_method AS ENUM (
    'cash',
    'bank'
);
 !   DROP TYPE public.payment_method;
       public          postgres    false         d           1247    145192    service_registration_status    TYPE     Z   CREATE TYPE public.service_registration_status AS ENUM (
    'in_use',
    'cancelled'
);
 .   DROP TYPE public.service_registration_status;
       public          postgres    false         g           1247    145198    service_status    TYPE     L   CREATE TYPE public.service_status AS ENUM (
    'active',
    'inactive'
);
 !   DROP TYPE public.service_status;
       public          postgres    false         j           1247    145204    task_status    TYPE     ^   CREATE TYPE public.task_status AS ENUM (
    'pending',
    'in_progress',
    'completed'
);
    DROP TYPE public.task_status;
       public          postgres    false         �            1259    145217    accounts_employee    TABLE     �   CREATE TABLE public.accounts_employee (
    account_id character varying NOT NULL,
    employee_id character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL
);
 %   DROP TABLE public.accounts_employee;
       public         heap    postgres    false         �            1259    145228    accounts_household    TABLE     �   CREATE TABLE public.accounts_household (
    account_id character varying NOT NULL,
    household_id character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL
);
 &   DROP TABLE public.accounts_household;
       public         heap    postgres    false         �            1259    145239    departments    TABLE     �   CREATE TABLE public.departments (
    department_id character varying NOT NULL,
    department_name character varying NOT NULL
);
    DROP TABLE public.departments;
       public         heap    postgres    false         �            1259    145246 	   employees    TABLE     �  CREATE TABLE public.employees (
    employee_id character varying NOT NULL,
    employee_name character varying NOT NULL,
    department_id character varying,
    account_id character varying NOT NULL,
    begin_date date DEFAULT CURRENT_DATE NOT NULL,
    "position" public.employee_position NOT NULL,
    phone character varying NOT NULL,
    address character varying NOT NULL,
    status public.employee_status DEFAULT 'active'::public.employee_status NOT NULL
);
    DROP TABLE public.employees;
       public         heap    postgres    false    853    853    856         �            1259    145265 
   households    TABLE     q  CREATE TABLE public.households (
    household_id character varying NOT NULL,
    account_id character varying NOT NULL,
    number_of_members integer NOT NULL,
    name character varying NOT NULL,
    phone character varying NOT NULL,
    room_number character varying NOT NULL,
    status public.household_status DEFAULT 'active'::public.household_status NOT NULL
);
    DROP TABLE public.households;
       public         heap    postgres    false    877    877         �            1259    145278 	   incidents    TABLE     �  CREATE TABLE public.incidents (
    incident_id character varying NOT NULL,
    incident_name character varying NOT NULL,
    responsible_id character varying NOT NULL,
    report_time timestamp without time zone NOT NULL,
    reporter_id character varying NOT NULL,
    description character varying,
    status public.incident_status DEFAULT 'in_progress'::public.incident_status NOT NULL
);
    DROP TABLE public.incidents;
       public         heap    postgres    false    859    859         �            1259    145316    invoice_details    TABLE       CREATE TABLE public.invoice_details (
    invoice_detail_id character varying NOT NULL,
    invoice_id character varying NOT NULL,
    service_id character varying NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL,
    total double precision NOT NULL
);
 #   DROP TABLE public.invoice_details;
       public         heap    postgres    false         �            1259    145304    invoices    TABLE     ;  CREATE TABLE public.invoices (
    invoice_id character varying NOT NULL,
    household_id character varying NOT NULL,
    amount double precision NOT NULL,
    month_date date NOT NULL,
    created_date timestamp without time zone NOT NULL,
    due_date date NOT NULL,
    status public.invoice_status NOT NULL
);
    DROP TABLE public.invoices;
       public         heap    postgres    false    862         �            1259    145333    notifications    TABLE     �   CREATE TABLE public.notifications (
    notification_id character varying NOT NULL,
    invoice_id character varying NOT NULL,
    household_id character varying NOT NULL,
    payment_id character varying NOT NULL,
    message character varying
);
 !   DROP TABLE public.notifications;
       public         heap    postgres    false         �            1259    145350    payments    TABLE       CREATE TABLE public.payments (
    payment_id character varying NOT NULL,
    invoice_id character varying NOT NULL,
    amount double precision NOT NULL,
    date timestamp without time zone NOT NULL,
    method public.payment_method,
    confirmed_by character varying
);
    DROP TABLE public.payments;
       public         heap    postgres    false    865         �            1259    145368    service_registrations    TABLE     ?  CREATE TABLE public.service_registrations (
    service_registration_id integer NOT NULL,
    household_id character varying NOT NULL,
    service_id character varying NOT NULL,
    start_date date NOT NULL,
    status public.service_registration_status DEFAULT 'in_use'::public.service_registration_status NOT NULL
);
 )   DROP TABLE public.service_registrations;
       public         heap    postgres    false    868    868         �            1259    145367 1   service_registrations_service_registration_id_seq    SEQUENCE     �   CREATE SEQUENCE public.service_registrations_service_registration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 H   DROP SEQUENCE public.service_registrations_service_registration_id_seq;
       public          postgres    false    227         B           0    0 1   service_registrations_service_registration_id_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.service_registrations_service_registration_id_seq OWNED BY public.service_registrations.service_registration_id;
          public          postgres    false    226         �            1259    145296    services    TABLE     �   CREATE TABLE public.services (
    service_id character varying NOT NULL,
    service_name character varying NOT NULL,
    price double precision NOT NULL,
    status public.service_status DEFAULT 'active'::public.service_status NOT NULL
);
    DROP TABLE public.services;
       public         heap    postgres    false    871    871         �            1259    145387    tasks    TABLE     �  CREATE TABLE public.tasks (
    task_id character varying NOT NULL,
    name_task character varying NOT NULL,
    assigner_id character varying NOT NULL,
    assignee_id character varying NOT NULL,
    assigned_time timestamp without time zone,
    description character varying,
    deadline timestamp without time zone,
    status public.task_status DEFAULT 'pending'::public.task_status NOT NULL
);
    DROP TABLE public.tasks;
       public         heap    postgres    false    874    874         j           2604    145371 -   service_registrations service_registration_id    DEFAULT     �   ALTER TABLE ONLY public.service_registrations ALTER COLUMN service_registration_id SET DEFAULT nextval('public.service_registrations_service_registration_id_seq'::regclass);
 \   ALTER TABLE public.service_registrations ALTER COLUMN service_registration_id DROP DEFAULT;
       public          postgres    false    226    227    227         .          0    145217    accounts_employee 
   TABLE DATA           X   COPY public.accounts_employee (account_id, employee_id, username, password) FROM stdin;
    public          postgres    false    215       4910.dat /          0    145228    accounts_household 
   TABLE DATA           Z   COPY public.accounts_household (account_id, household_id, username, password) FROM stdin;
    public          postgres    false    216       4911.dat 0          0    145239    departments 
   TABLE DATA           E   COPY public.departments (department_id, department_name) FROM stdin;
    public          postgres    false    217       4912.dat 1          0    145246 	   employees 
   TABLE DATA           �   COPY public.employees (employee_id, employee_name, department_id, account_id, begin_date, "position", phone, address, status) FROM stdin;
    public          postgres    false    218       4913.dat 2          0    145265 
   households 
   TABLE DATA           s   COPY public.households (household_id, account_id, number_of_members, name, phone, room_number, status) FROM stdin;
    public          postgres    false    219       4914.dat 3          0    145278 	   incidents 
   TABLE DATA           ~   COPY public.incidents (incident_id, incident_name, responsible_id, report_time, reporter_id, description, status) FROM stdin;
    public          postgres    false    220       4915.dat 6          0    145316    invoice_details 
   TABLE DATA           l   COPY public.invoice_details (invoice_detail_id, invoice_id, service_id, quantity, price, total) FROM stdin;
    public          postgres    false    223       4918.dat 5          0    145304    invoices 
   TABLE DATA           p   COPY public.invoices (invoice_id, household_id, amount, month_date, created_date, due_date, status) FROM stdin;
    public          postgres    false    222       4917.dat 7          0    145333    notifications 
   TABLE DATA           g   COPY public.notifications (notification_id, invoice_id, household_id, payment_id, message) FROM stdin;
    public          postgres    false    224       4919.dat 8          0    145350    payments 
   TABLE DATA           ^   COPY public.payments (payment_id, invoice_id, amount, date, method, confirmed_by) FROM stdin;
    public          postgres    false    225       4920.dat :          0    145368    service_registrations 
   TABLE DATA           v   COPY public.service_registrations (service_registration_id, household_id, service_id, start_date, status) FROM stdin;
    public          postgres    false    227       4922.dat 4          0    145296    services 
   TABLE DATA           K   COPY public.services (service_id, service_name, price, status) FROM stdin;
    public          postgres    false    221       4916.dat ;          0    145387    tasks 
   TABLE DATA           {   COPY public.tasks (task_id, name_task, assigner_id, assignee_id, assigned_time, description, deadline, status) FROM stdin;
    public          postgres    false    228       4923.dat C           0    0 1   service_registrations_service_registration_id_seq    SEQUENCE SET     _   SELECT pg_catalog.setval('public.service_registrations_service_registration_id_seq', 4, true);
          public          postgres    false    226         n           2606    145225 3   accounts_employee accounts_employee_employee_id_key 
   CONSTRAINT     u   ALTER TABLE ONLY public.accounts_employee
    ADD CONSTRAINT accounts_employee_employee_id_key UNIQUE (employee_id);
 ]   ALTER TABLE ONLY public.accounts_employee DROP CONSTRAINT accounts_employee_employee_id_key;
       public            postgres    false    215         p           2606    145223 (   accounts_employee accounts_employee_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.accounts_employee
    ADD CONSTRAINT accounts_employee_pkey PRIMARY KEY (account_id);
 R   ALTER TABLE ONLY public.accounts_employee DROP CONSTRAINT accounts_employee_pkey;
       public            postgres    false    215         r           2606    145227 0   accounts_employee accounts_employee_username_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.accounts_employee
    ADD CONSTRAINT accounts_employee_username_key UNIQUE (username);
 Z   ALTER TABLE ONLY public.accounts_employee DROP CONSTRAINT accounts_employee_username_key;
       public            postgres    false    215         t           2606    145236 6   accounts_household accounts_household_household_id_key 
   CONSTRAINT     y   ALTER TABLE ONLY public.accounts_household
    ADD CONSTRAINT accounts_household_household_id_key UNIQUE (household_id);
 `   ALTER TABLE ONLY public.accounts_household DROP CONSTRAINT accounts_household_household_id_key;
       public            postgres    false    216         v           2606    145234 *   accounts_household accounts_household_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.accounts_household
    ADD CONSTRAINT accounts_household_pkey PRIMARY KEY (account_id);
 T   ALTER TABLE ONLY public.accounts_household DROP CONSTRAINT accounts_household_pkey;
       public            postgres    false    216         x           2606    145238 2   accounts_household accounts_household_username_key 
   CONSTRAINT     q   ALTER TABLE ONLY public.accounts_household
    ADD CONSTRAINT accounts_household_username_key UNIQUE (username);
 \   ALTER TABLE ONLY public.accounts_household DROP CONSTRAINT accounts_household_username_key;
       public            postgres    false    216         z           2606    145245    departments departments_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);
 F   ALTER TABLE ONLY public.departments DROP CONSTRAINT departments_pkey;
       public            postgres    false    217         |           2606    145254    employees employees_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);
 B   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_pkey;
       public            postgres    false    218         ~           2606    145272    households households_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_pkey PRIMARY KEY (household_id);
 D   ALTER TABLE ONLY public.households DROP CONSTRAINT households_pkey;
       public            postgres    false    219         �           2606    145285    incidents incidents_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_pkey PRIMARY KEY (incident_id);
 B   ALTER TABLE ONLY public.incidents DROP CONSTRAINT incidents_pkey;
       public            postgres    false    220         �           2606    145322 $   invoice_details invoice_details_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_pkey PRIMARY KEY (invoice_detail_id);
 N   ALTER TABLE ONLY public.invoice_details DROP CONSTRAINT invoice_details_pkey;
       public            postgres    false    223         �           2606    145310    invoices invoices_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (invoice_id);
 @   ALTER TABLE ONLY public.invoices DROP CONSTRAINT invoices_pkey;
       public            postgres    false    222         �           2606    145339     notifications notifications_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public            postgres    false    224         �           2606    145356    payments payments_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);
 @   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_pkey;
       public            postgres    false    225         �           2606    145376 0   service_registrations service_registrations_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.service_registrations
    ADD CONSTRAINT service_registrations_pkey PRIMARY KEY (service_registration_id);
 Z   ALTER TABLE ONLY public.service_registrations DROP CONSTRAINT service_registrations_pkey;
       public            postgres    false    227         �           2606    145303    services services_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (service_id);
 @   ALTER TABLE ONLY public.services DROP CONSTRAINT services_pkey;
       public            postgres    false    221         �           2606    145394    tasks tasks_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (task_id);
 :   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_pkey;
       public            postgres    false    228         �           2606    145260 #   employees employees_account_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts_employee(account_id);
 M   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_account_id_fkey;
       public          postgres    false    215    218    4720         �           2606    145255 &   employees employees_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id);
 P   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_department_id_fkey;
       public          postgres    false    4730    217    218         �           2606    145273 %   households households_account_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts_household(account_id);
 O   ALTER TABLE ONLY public.households DROP CONSTRAINT households_account_id_fkey;
       public          postgres    false    219    4726    216         �           2606    145291 $   incidents incidents_reporter_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.employees(employee_id);
 N   ALTER TABLE ONLY public.incidents DROP CONSTRAINT incidents_reporter_id_fkey;
       public          postgres    false    218    220    4732         �           2606    145286 '   incidents incidents_responsible_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_responsible_id_fkey FOREIGN KEY (responsible_id) REFERENCES public.employees(employee_id);
 Q   ALTER TABLE ONLY public.incidents DROP CONSTRAINT incidents_responsible_id_fkey;
       public          postgres    false    4732    220    218         �           2606    145323 /   invoice_details invoice_details_invoice_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(invoice_id);
 Y   ALTER TABLE ONLY public.invoice_details DROP CONSTRAINT invoice_details_invoice_id_fkey;
       public          postgres    false    223    4740    222         �           2606    145328 /   invoice_details invoice_details_service_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(service_id);
 Y   ALTER TABLE ONLY public.invoice_details DROP CONSTRAINT invoice_details_service_id_fkey;
       public          postgres    false    221    4738    223         �           2606    145311 #   invoices invoices_household_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id);
 M   ALTER TABLE ONLY public.invoices DROP CONSTRAINT invoices_household_id_fkey;
       public          postgres    false    219    4734    222         �           2606    145345 -   notifications notifications_household_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id);
 W   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_household_id_fkey;
       public          postgres    false    219    224    4734         �           2606    145340 +   notifications notifications_invoice_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(invoice_id);
 U   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_invoice_id_fkey;
       public          postgres    false    222    4740    224         �           2606    145362 #   payments payments_confirmed_by_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_confirmed_by_fkey FOREIGN KEY (confirmed_by) REFERENCES public.employees(employee_id);
 M   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_confirmed_by_fkey;
       public          postgres    false    225    218    4732         �           2606    145357 !   payments payments_invoice_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(invoice_id);
 K   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_invoice_id_fkey;
       public          postgres    false    222    225    4740         �           2606    145377 =   service_registrations service_registrations_household_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.service_registrations
    ADD CONSTRAINT service_registrations_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id);
 g   ALTER TABLE ONLY public.service_registrations DROP CONSTRAINT service_registrations_household_id_fkey;
       public          postgres    false    227    4734    219         �           2606    145382 ;   service_registrations service_registrations_service_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.service_registrations
    ADD CONSTRAINT service_registrations_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(service_id);
 e   ALTER TABLE ONLY public.service_registrations DROP CONSTRAINT service_registrations_service_id_fkey;
       public          postgres    false    4738    221    227         �           2606    145400    tasks tasks_assignee_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES public.employees(employee_id);
 F   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_assignee_id_fkey;
       public          postgres    false    228    218    4732         �           2606    145395    tasks tasks_assigner_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assigner_id_fkey FOREIGN KEY (assigner_id) REFERENCES public.employees(employee_id);
 F   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_assigner_id_fkey;
       public          postgres    false    218    228    4732                                                                                                                                                                                                                                                                                                                                                                                                                                                      4910.dat                                                                                            0000600 0004000 0002000 00000001147 15005361504 0014251 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        ACC001	EMP001	admin	admin
ACC002	EMP002	manager_recep	password123
ACC003	EMP003	staff1_recep	password123
ACC004	EMP004	staff2_recep	password123
ACC005	EMP005	manager_clean	password123
ACC006	EMP006	staff1_clean	password123
ACC007	EMP007	staff2_clean	password123
ACC008	EMP008	manager_secur	password123
ACC009	EMP009	staff1_secur	password123
ACC010	EMP010	staff2_secur	password123
ACC011	EMP011	manager_acct	password123
ACC012	EMP012	staff1_acct	password123
ACC013	EMP013	staff2_acct	password123
ACC014	EMP014	manager_tech	password123
ACC015	EMP015	staff1_tech	password123
ACC016	EMP016	staff2_tech	password123
\.


                                                                                                                                                                                                                                                                                                                                                                                                                         4911.dat                                                                                            0000600 0004000 0002000 00000000271 15005361504 0014247 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        ACC017	HH001	household1	password123
ACC018	HH002	household2	password123
ACC019	HH003	household3	password123
ACC020	HH004	household4	password123
ACC021	HH005	household5	password123
\.


                                                                                                                                                                                                                                                                                                                                       4912.dat                                                                                            0000600 0004000 0002000 00000000122 15005361504 0014243 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        RECEP	Reception
CLEAN	Cleaning
SECUR	Security
ACCT	Accounting
TECH	Technical
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                              4913.dat                                                                                            0000600 0004000 0002000 00000002622 15005361504 0014253 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        EMP001	Admin User	\N	ACC001	2023-01-01	head_manager	123456789	Admin Address	active
EMP002	Manager Reception	RECEP	ACC002	2023-01-01	manager	123456001	Reception Address	active
EMP003	Staff1 Reception	RECEP	ACC003	2023-01-01	staff	123456002	Reception Address	active
EMP004	Staff2 Reception	RECEP	ACC004	2023-01-01	staff	123456003	Reception Address	active
EMP005	Manager Cleaning	CLEAN	ACC005	2023-01-01	manager	123456004	Cleaning Address	active
EMP006	Staff1 Cleaning	CLEAN	ACC006	2023-01-01	staff	123456005	Cleaning Address	active
EMP007	Staff2 Cleaning	CLEAN	ACC007	2023-01-01	staff	123456006	Cleaning Address	active
EMP008	Manager Security	SECUR	ACC008	2023-01-01	manager	123456007	Security Address	active
EMP009	Staff1 Security	SECUR	ACC009	2023-01-01	staff	123456008	Security Address	active
EMP010	Staff2 Security	SECUR	ACC010	2023-01-01	staff	123456009	Security Address	active
EMP011	Manager Accounting	ACCT	ACC011	2023-01-01	manager	123456010	Accounting Address	active
EMP012	Staff1 Accounting	ACCT	ACC012	2023-01-01	staff	123456011	Accounting Address	active
EMP013	Staff2 Accounting	ACCT	ACC013	2023-01-01	staff	123456012	Accounting Address	active
EMP014	Manager Technical	TECH	ACC014	2023-01-01	manager	123456013	Technical Address	active
EMP015	Staff1 Technical	TECH	ACC015	2023-01-01	staff	123456014	Technical Address	active
EMP016	Staff2 Technical	TECH	ACC016	2023-01-01	staff	123456015	Technical Address	active
\.


                                                                                                              4914.dat                                                                                            0000600 0004000 0002000 00000000365 15005361504 0014256 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        HH001	ACC017	3	Household 1	987654321	101	active
HH002	ACC018	4	Household 2	987654322	102	active
HH003	ACC019	2	Household 3	987654323	103	active
HH004	ACC020	5	Household 4	987654324	104	active
HH005	ACC021	1	Household 5	987654325	105	active
\.


                                                                                                                                                                                                                                                                           4915.dat                                                                                            0000600 0004000 0002000 00000000253 15005361504 0014253 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        INC001	Power Outage	EMP002	2023-01-10 08:00:00	EMP003	Power out in room 101	resolved
INC002	Leak	EMP005	2023-02-15 09:00:00	EMP006	Water leak in room 102	in_progress
\.


                                                                                                                                                                                                                                                                                                                                                     4918.dat                                                                                            0000600 0004000 0002000 00000000146 15005361504 0014257 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        IDET001	INV001	SVC001	100	0.1	10
IDET002	INV001	SVC002	300	0.05	15
IDET003	INV002	SVC003	1	20	20
\.


                                                                                                                                                                                                                                                                                                                                                                                                                          4917.dat                                                                                            0000600 0004000 0002000 00000000206 15005361504 0014253 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        INV001	HH001	25	2023-01-01	2023-01-02 10:00:00	2023-01-31	paid
INV002	HH002	20	2023-02-01	2023-02-02 10:00:00	2023-02-28	overdue
\.


                                                                                                                                                                                                                                                                                                                                                                                          4919.dat                                                                                            0000600 0004000 0002000 00000000145 15005361504 0014257 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        NOT001	INV001	HH001	PAY001	Payment received
NOT002	INV002	HH002	PAY002	Partial payment received
\.


                                                                                                                                                                                                                                                                                                                                                                                                                           4920.dat                                                                                            0000600 0004000 0002000 00000000147 15005361504 0014251 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PAY001	INV001	25	2023-01-15 14:00:00	cash	EMP001
PAY002	INV002	10	2023-03-01 09:00:00	bank	EMP011
\.


                                                                                                                                                                                                                                                                                                                                                                                                                         4922.dat                                                                                            0000600 0004000 0002000 00000000211 15005361504 0014243 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	HH001	SVC001	2023-01-01	in_use
2	HH001	SVC002	2023-01-01	in_use
3	HH002	SVC003	2023-02-01	in_use
4	HH003	SVC004	2023-03-01	in_use
\.


                                                                                                                                                                                                                                                                                                                                                                                       4916.dat                                                                                            0000600 0004000 0002000 00000000160 15005361504 0014251 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        SVC001	Electricity	0.1	active
SVC002	Water	0.05	active
SVC003	Internet	20	active
SVC004	Cleaning	10	active
\.


                                                                                                                                                                                                                                                                                                                                                                                                                4923.dat                                                                                            0000600 0004000 0002000 00000000723 15005361504 0014254 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        TASK001	Fix Power	EMP001	EMP002	2023-01-10 00:00:00	Restore power in room 101	2023-01-11 00:00:00	completed
TASK002	Repair Leak	EMP001	EMP005	2023-02-15 00:00:00	Fix leak in room 102	2023-02-20 00:00:00	in_progress
TASK003	Clean Reception Area	EMP002	EMP003	2023-03-01 00:00:00	Clean and organize reception area	2023-03-02 00:00:00	pending
TASK004	Security Patrol	EMP008	EMP009	2023-04-01 00:00:00	Security patrol around the building	2023-04-02 00:00:00	pending
\.


                                             restore.sql                                                                                         0000600 0004000 0002000 00000052554 15005361504 0015376 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

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

DROP DATABASE pttk1;
--
-- Name: pttk1; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE pttk1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'vi-VN';


ALTER DATABASE pttk1 OWNER TO postgres;

\connect pttk1

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

--
-- Name: employee_position; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.employee_position AS ENUM (
    'manager',
    'staff',
    'head_manager'
);


ALTER TYPE public.employee_position OWNER TO postgres;

--
-- Name: employee_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.employee_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.employee_status OWNER TO postgres;

--
-- Name: household_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.household_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.household_status OWNER TO postgres;

--
-- Name: incident_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.incident_status AS ENUM (
    'in_progress',
    'resolved'
);


ALTER TYPE public.incident_status OWNER TO postgres;

--
-- Name: invoice_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.invoice_status AS ENUM (
    'paid',
    'overdue'
);


ALTER TYPE public.invoice_status OWNER TO postgres;

--
-- Name: payment_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_method AS ENUM (
    'cash',
    'bank'
);


ALTER TYPE public.payment_method OWNER TO postgres;

--
-- Name: service_registration_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.service_registration_status AS ENUM (
    'in_use',
    'cancelled'
);


ALTER TYPE public.service_registration_status OWNER TO postgres;

--
-- Name: service_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.service_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.service_status OWNER TO postgres;

--
-- Name: task_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.task_status AS ENUM (
    'pending',
    'in_progress',
    'completed'
);


ALTER TYPE public.task_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts_employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts_employee (
    account_id character varying NOT NULL,
    employee_id character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.accounts_employee OWNER TO postgres;

--
-- Name: accounts_household; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts_household (
    account_id character varying NOT NULL,
    household_id character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.accounts_household OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    department_id character varying NOT NULL,
    department_name character varying NOT NULL
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    employee_id character varying NOT NULL,
    employee_name character varying NOT NULL,
    department_id character varying,
    account_id character varying NOT NULL,
    begin_date date DEFAULT CURRENT_DATE NOT NULL,
    "position" public.employee_position NOT NULL,
    phone character varying NOT NULL,
    address character varying NOT NULL,
    status public.employee_status DEFAULT 'active'::public.employee_status NOT NULL
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: households; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.households (
    household_id character varying NOT NULL,
    account_id character varying NOT NULL,
    number_of_members integer NOT NULL,
    name character varying NOT NULL,
    phone character varying NOT NULL,
    room_number character varying NOT NULL,
    status public.household_status DEFAULT 'active'::public.household_status NOT NULL
);


ALTER TABLE public.households OWNER TO postgres;

--
-- Name: incidents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incidents (
    incident_id character varying NOT NULL,
    incident_name character varying NOT NULL,
    responsible_id character varying NOT NULL,
    report_time timestamp without time zone NOT NULL,
    reporter_id character varying NOT NULL,
    description character varying,
    status public.incident_status DEFAULT 'in_progress'::public.incident_status NOT NULL
);


ALTER TABLE public.incidents OWNER TO postgres;

--
-- Name: invoice_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_details (
    invoice_detail_id character varying NOT NULL,
    invoice_id character varying NOT NULL,
    service_id character varying NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL,
    total double precision NOT NULL
);


ALTER TABLE public.invoice_details OWNER TO postgres;

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    invoice_id character varying NOT NULL,
    household_id character varying NOT NULL,
    amount double precision NOT NULL,
    month_date date NOT NULL,
    created_date timestamp without time zone NOT NULL,
    due_date date NOT NULL,
    status public.invoice_status NOT NULL
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    notification_id character varying NOT NULL,
    invoice_id character varying NOT NULL,
    household_id character varying NOT NULL,
    payment_id character varying NOT NULL,
    message character varying
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id character varying NOT NULL,
    invoice_id character varying NOT NULL,
    amount double precision NOT NULL,
    date timestamp without time zone NOT NULL,
    method public.payment_method,
    confirmed_by character varying
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: service_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_registrations (
    service_registration_id integer NOT NULL,
    household_id character varying NOT NULL,
    service_id character varying NOT NULL,
    start_date date NOT NULL,
    status public.service_registration_status DEFAULT 'in_use'::public.service_registration_status NOT NULL
);


ALTER TABLE public.service_registrations OWNER TO postgres;

--
-- Name: service_registrations_service_registration_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.service_registrations_service_registration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_registrations_service_registration_id_seq OWNER TO postgres;

--
-- Name: service_registrations_service_registration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.service_registrations_service_registration_id_seq OWNED BY public.service_registrations.service_registration_id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    service_id character varying NOT NULL,
    service_name character varying NOT NULL,
    price double precision NOT NULL,
    status public.service_status DEFAULT 'active'::public.service_status NOT NULL
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    task_id character varying NOT NULL,
    name_task character varying NOT NULL,
    assigner_id character varying NOT NULL,
    assignee_id character varying NOT NULL,
    assigned_time timestamp without time zone,
    description character varying,
    deadline timestamp without time zone,
    status public.task_status DEFAULT 'pending'::public.task_status NOT NULL
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: service_registrations service_registration_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_registrations ALTER COLUMN service_registration_id SET DEFAULT nextval('public.service_registrations_service_registration_id_seq'::regclass);


--
-- Data for Name: accounts_employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts_employee (account_id, employee_id, username, password) FROM stdin;
\.
COPY public.accounts_employee (account_id, employee_id, username, password) FROM '$$PATH$$/4910.dat';

--
-- Data for Name: accounts_household; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts_household (account_id, household_id, username, password) FROM stdin;
\.
COPY public.accounts_household (account_id, household_id, username, password) FROM '$$PATH$$/4911.dat';

--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (department_id, department_name) FROM stdin;
\.
COPY public.departments (department_id, department_name) FROM '$$PATH$$/4912.dat';

--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (employee_id, employee_name, department_id, account_id, begin_date, "position", phone, address, status) FROM stdin;
\.
COPY public.employees (employee_id, employee_name, department_id, account_id, begin_date, "position", phone, address, status) FROM '$$PATH$$/4913.dat';

--
-- Data for Name: households; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.households (household_id, account_id, number_of_members, name, phone, room_number, status) FROM stdin;
\.
COPY public.households (household_id, account_id, number_of_members, name, phone, room_number, status) FROM '$$PATH$$/4914.dat';

--
-- Data for Name: incidents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.incidents (incident_id, incident_name, responsible_id, report_time, reporter_id, description, status) FROM stdin;
\.
COPY public.incidents (incident_id, incident_name, responsible_id, report_time, reporter_id, description, status) FROM '$$PATH$$/4915.dat';

--
-- Data for Name: invoice_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_details (invoice_detail_id, invoice_id, service_id, quantity, price, total) FROM stdin;
\.
COPY public.invoice_details (invoice_detail_id, invoice_id, service_id, quantity, price, total) FROM '$$PATH$$/4918.dat';

--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (invoice_id, household_id, amount, month_date, created_date, due_date, status) FROM stdin;
\.
COPY public.invoices (invoice_id, household_id, amount, month_date, created_date, due_date, status) FROM '$$PATH$$/4917.dat';

--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (notification_id, invoice_id, household_id, payment_id, message) FROM stdin;
\.
COPY public.notifications (notification_id, invoice_id, household_id, payment_id, message) FROM '$$PATH$$/4919.dat';

--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, invoice_id, amount, date, method, confirmed_by) FROM stdin;
\.
COPY public.payments (payment_id, invoice_id, amount, date, method, confirmed_by) FROM '$$PATH$$/4920.dat';

--
-- Data for Name: service_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_registrations (service_registration_id, household_id, service_id, start_date, status) FROM stdin;
\.
COPY public.service_registrations (service_registration_id, household_id, service_id, start_date, status) FROM '$$PATH$$/4922.dat';

--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (service_id, service_name, price, status) FROM stdin;
\.
COPY public.services (service_id, service_name, price, status) FROM '$$PATH$$/4916.dat';

--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (task_id, name_task, assigner_id, assignee_id, assigned_time, description, deadline, status) FROM stdin;
\.
COPY public.tasks (task_id, name_task, assigner_id, assignee_id, assigned_time, description, deadline, status) FROM '$$PATH$$/4923.dat';

--
-- Name: service_registrations_service_registration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_registrations_service_registration_id_seq', 4, true);


--
-- Name: accounts_employee accounts_employee_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts_employee
    ADD CONSTRAINT accounts_employee_employee_id_key UNIQUE (employee_id);


--
-- Name: accounts_employee accounts_employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts_employee
    ADD CONSTRAINT accounts_employee_pkey PRIMARY KEY (account_id);


--
-- Name: accounts_employee accounts_employee_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts_employee
    ADD CONSTRAINT accounts_employee_username_key UNIQUE (username);


--
-- Name: accounts_household accounts_household_household_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts_household
    ADD CONSTRAINT accounts_household_household_id_key UNIQUE (household_id);


--
-- Name: accounts_household accounts_household_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts_household
    ADD CONSTRAINT accounts_household_pkey PRIMARY KEY (account_id);


--
-- Name: accounts_household accounts_household_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts_household
    ADD CONSTRAINT accounts_household_username_key UNIQUE (username);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);


--
-- Name: households households_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_pkey PRIMARY KEY (household_id);


--
-- Name: incidents incidents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_pkey PRIMARY KEY (incident_id);


--
-- Name: invoice_details invoice_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_pkey PRIMARY KEY (invoice_detail_id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (invoice_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- Name: service_registrations service_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_registrations
    ADD CONSTRAINT service_registrations_pkey PRIMARY KEY (service_registration_id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (service_id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (task_id);


--
-- Name: employees employees_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts_employee(account_id);


--
-- Name: employees employees_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id);


--
-- Name: households households_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts_household(account_id);


--
-- Name: incidents incidents_reporter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.employees(employee_id);


--
-- Name: incidents incidents_responsible_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_responsible_id_fkey FOREIGN KEY (responsible_id) REFERENCES public.employees(employee_id);


--
-- Name: invoice_details invoice_details_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(invoice_id);


--
-- Name: invoice_details invoice_details_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(service_id);


--
-- Name: invoices invoices_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id);


--
-- Name: notifications notifications_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id);


--
-- Name: notifications notifications_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(invoice_id);


--
-- Name: payments payments_confirmed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_confirmed_by_fkey FOREIGN KEY (confirmed_by) REFERENCES public.employees(employee_id);


--
-- Name: payments payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(invoice_id);


--
-- Name: service_registrations service_registrations_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_registrations
    ADD CONSTRAINT service_registrations_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id);


--
-- Name: service_registrations service_registrations_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_registrations
    ADD CONSTRAINT service_registrations_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(service_id);


--
-- Name: tasks tasks_assignee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES public.employees(employee_id);


--
-- Name: tasks tasks_assigner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assigner_id_fkey FOREIGN KEY (assigner_id) REFERENCES public.employees(employee_id);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    