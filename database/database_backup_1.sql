toc.dat                                                                                             0000600 0004000 0002000 00000053761 15005116730 0014451 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP                        }            pttk    16.8    16.8 A    )           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         *           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         +           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         ,           1262    144687    pttk    DATABASE     j   CREATE DATABASE pttk WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'vi-VN';
    DROP DATABASE pttk;
                postgres    false         V           1247    144694    employee_position    TYPE     M   CREATE TYPE public.employee_position AS ENUM (
    'manager',
    'staff'
);
 $   DROP TYPE public.employee_position;
       public          postgres    false         S           1247    144689    employee_status    TYPE     M   CREATE TYPE public.employee_status AS ENUM (
    'active',
    'inactive'
);
 "   DROP TYPE public.employee_status;
       public          postgres    false         Y           1247    144700    incident_status    TYPE     R   CREATE TYPE public.incident_status AS ENUM (
    'in_progress',
    'resolved'
);
 "   DROP TYPE public.incident_status;
       public          postgres    false         \           1247    144706    invoice_status    TYPE     I   CREATE TYPE public.invoice_status AS ENUM (
    'paid',
    'overdue'
);
 !   DROP TYPE public.invoice_status;
       public          postgres    false         _           1247    144712    payment_method    TYPE     O   CREATE TYPE public.payment_method AS ENUM (
    'cash',
    'bank_transfer'
);
 !   DROP TYPE public.payment_method;
       public          postgres    false         b           1247    144718    service_registration_status    TYPE     Z   CREATE TYPE public.service_registration_status AS ENUM (
    'in_use',
    'cancelled'
);
 .   DROP TYPE public.service_registration_status;
       public          postgres    false         e           1247    144724    service_status    TYPE     L   CREATE TYPE public.service_status AS ENUM (
    'active',
    'inactive'
);
 !   DROP TYPE public.service_status;
       public          postgres    false         h           1247    144730    task_status    TYPE     ^   CREATE TYPE public.task_status AS ENUM (
    'pending',
    'in_progress',
    'completed'
);
    DROP TYPE public.task_status;
       public          postgres    false         �            1259    144744    accounts    TABLE     �   CREATE TABLE public.accounts (
    account_id character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL
);
    DROP TABLE public.accounts;
       public         heap    postgres    false         �            1259    144737    departments    TABLE     �   CREATE TABLE public.departments (
    department_id character varying NOT NULL,
    department_name character varying NOT NULL
);
    DROP TABLE public.departments;
       public         heap    postgres    false         �            1259    144751 	   employees    TABLE     �  CREATE TABLE public.employees (
    employee_id character varying NOT NULL,
    employee_name character varying NOT NULL,
    department_id character varying NOT NULL,
    account_id character varying NOT NULL,
    begin_date date DEFAULT CURRENT_DATE NOT NULL,
    "position" public.employee_position NOT NULL,
    phone character varying NOT NULL,
    address character varying NOT NULL,
    status public.employee_status DEFAULT 'active'::public.employee_status NOT NULL
);
    DROP TABLE public.employees;
       public         heap    postgres    false    851    851    854         �            1259    144770 
   households    TABLE       CREATE TABLE public.households (
    household_id character varying NOT NULL,
    account_id character varying NOT NULL,
    number_of_members integer NOT NULL,
    name character varying NOT NULL,
    phone character varying NOT NULL,
    room_number character varying NOT NULL
);
    DROP TABLE public.households;
       public         heap    postgres    false         �            1259    144876 	   incidents    TABLE     �  CREATE TABLE public.incidents (
    incident_id character varying NOT NULL,
    incident_name character varying NOT NULL,
    responsible_id character varying NOT NULL,
    report_time timestamp without time zone NOT NULL,
    reporter_id character varying NOT NULL,
    description character varying,
    status public.incident_status DEFAULT 'in_progress'::public.incident_status NOT NULL
);
    DROP TABLE public.incidents;
       public         heap    postgres    false    857    857         �            1259    144859    invoice_details    TABLE       CREATE TABLE public.invoice_details (
    invoice_detail_id character varying NOT NULL,
    invoice_id character varying NOT NULL,
    service_id character varying NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL,
    total double precision NOT NULL
);
 #   DROP TABLE public.invoice_details;
       public         heap    postgres    false         �            1259    144790    invoices    TABLE     ;  CREATE TABLE public.invoices (
    invoice_id character varying NOT NULL,
    household_id character varying NOT NULL,
    amount double precision NOT NULL,
    month_date date NOT NULL,
    created_date timestamp without time zone NOT NULL,
    due_date date NOT NULL,
    status public.invoice_status NOT NULL
);
    DROP TABLE public.invoices;
       public         heap    postgres    false    860         �            1259    144819    notifications    TABLE     �   CREATE TABLE public.notifications (
    notification_id character varying NOT NULL,
    invoice_id character varying NOT NULL,
    household_id character varying NOT NULL,
    payment_id character varying NOT NULL,
    message character varying
);
 !   DROP TABLE public.notifications;
       public         heap    postgres    false         �            1259    144802    payments    TABLE       CREATE TABLE public.payments (
    payment_id character varying NOT NULL,
    invoice_id character varying NOT NULL,
    amount double precision NOT NULL,
    date timestamp without time zone NOT NULL,
    method public.payment_method,
    confirmed_by character varying
);
    DROP TABLE public.payments;
       public         heap    postgres    false    863         �            1259    144841    service_registrations    TABLE     @  CREATE TABLE public.service_registrations (
    service_registration_id character varying NOT NULL,
    household_id character varying NOT NULL,
    service_id character varying NOT NULL,
    start_date date NOT NULL,
    status public.service_registration_status DEFAULT 'in_use'::public.service_registration_status
);
 )   DROP TABLE public.service_registrations;
       public         heap    postgres    false    866    866         �            1259    144782    services    TABLE     �   CREATE TABLE public.services (
    service_id character varying NOT NULL,
    service_name character varying NOT NULL,
    price double precision NOT NULL,
    status public.service_status DEFAULT 'active'::public.service_status NOT NULL
);
    DROP TABLE public.services;
       public         heap    postgres    false    869    869         �            1259    144894    tasks    TABLE     [  CREATE TABLE public.tasks (
    task_id character varying NOT NULL,
    name_task character varying NOT NULL,
    assigner_id character varying NOT NULL,
    assignee_id character varying NOT NULL,
    assigned_time date,
    description character varying,
    deadline date,
    status public.task_status DEFAULT 'pending'::public.task_status
);
    DROP TABLE public.tasks;
       public         heap    postgres    false    872    872                   0    144744    accounts 
   TABLE DATA           B   COPY public.accounts (account_id, username, password) FROM stdin;
    public          postgres    false    216       4892.dat           0    144737    departments 
   TABLE DATA           E   COPY public.departments (department_id, department_name) FROM stdin;
    public          postgres    false    215       4891.dat           0    144751 	   employees 
   TABLE DATA           �   COPY public.employees (employee_id, employee_name, department_id, account_id, begin_date, "position", phone, address, status) FROM stdin;
    public          postgres    false    217       4893.dat           0    144770 
   households 
   TABLE DATA           k   COPY public.households (household_id, account_id, number_of_members, name, phone, room_number) FROM stdin;
    public          postgres    false    218       4894.dat %          0    144876 	   incidents 
   TABLE DATA           ~   COPY public.incidents (incident_id, incident_name, responsible_id, report_time, reporter_id, description, status) FROM stdin;
    public          postgres    false    225       4901.dat $          0    144859    invoice_details 
   TABLE DATA           l   COPY public.invoice_details (invoice_detail_id, invoice_id, service_id, quantity, price, total) FROM stdin;
    public          postgres    false    224       4900.dat            0    144790    invoices 
   TABLE DATA           p   COPY public.invoices (invoice_id, household_id, amount, month_date, created_date, due_date, status) FROM stdin;
    public          postgres    false    220       4896.dat "          0    144819    notifications 
   TABLE DATA           g   COPY public.notifications (notification_id, invoice_id, household_id, payment_id, message) FROM stdin;
    public          postgres    false    222       4898.dat !          0    144802    payments 
   TABLE DATA           ^   COPY public.payments (payment_id, invoice_id, amount, date, method, confirmed_by) FROM stdin;
    public          postgres    false    221       4897.dat #          0    144841    service_registrations 
   TABLE DATA           v   COPY public.service_registrations (service_registration_id, household_id, service_id, start_date, status) FROM stdin;
    public          postgres    false    223       4899.dat           0    144782    services 
   TABLE DATA           K   COPY public.services (service_id, service_name, price, status) FROM stdin;
    public          postgres    false    219       4895.dat &          0    144894    tasks 
   TABLE DATA           {   COPY public.tasks (task_id, name_task, assigner_id, assignee_id, assigned_time, description, deadline, status) FROM stdin;
    public          postgres    false    226       4902.dat f           2606    144750    accounts accounts_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (account_id);
 @   ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_pkey;
       public            postgres    false    216         d           2606    144743    departments departments_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);
 F   ALTER TABLE ONLY public.departments DROP CONSTRAINT departments_pkey;
       public            postgres    false    215         h           2606    144759    employees employees_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);
 B   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_pkey;
       public            postgres    false    217         j           2606    144776    households households_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_pkey PRIMARY KEY (household_id);
 D   ALTER TABLE ONLY public.households DROP CONSTRAINT households_pkey;
       public            postgres    false    218         x           2606    144883    incidents incidents_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_pkey PRIMARY KEY (incident_id);
 B   ALTER TABLE ONLY public.incidents DROP CONSTRAINT incidents_pkey;
       public            postgres    false    225         v           2606    144865 $   invoice_details invoice_details_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_pkey PRIMARY KEY (invoice_detail_id);
 N   ALTER TABLE ONLY public.invoice_details DROP CONSTRAINT invoice_details_pkey;
       public            postgres    false    224         n           2606    144796    invoices invoices_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (invoice_id);
 @   ALTER TABLE ONLY public.invoices DROP CONSTRAINT invoices_pkey;
       public            postgres    false    220         r           2606    144825     notifications notifications_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public            postgres    false    222         p           2606    144808    payments payments_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);
 @   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_pkey;
       public            postgres    false    221         t           2606    144848 0   service_registrations service_registrations_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.service_registrations
    ADD CONSTRAINT service_registrations_pkey PRIMARY KEY (service_registration_id);
 Z   ALTER TABLE ONLY public.service_registrations DROP CONSTRAINT service_registrations_pkey;
       public            postgres    false    223         l           2606    144789    services services_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (service_id);
 @   ALTER TABLE ONLY public.services DROP CONSTRAINT services_pkey;
       public            postgres    false    219         z           2606    144901    tasks tasks_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (task_id);
 :   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_pkey;
       public            postgres    false    226         {           2606    144765 #   employees employees_account_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(account_id);
 M   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_account_id_fkey;
       public          postgres    false    4710    217    216         |           2606    144760 &   employees employees_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id);
 P   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_department_id_fkey;
       public          postgres    false    217    215    4708         }           2606    144777 %   households households_account_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(account_id);
 O   ALTER TABLE ONLY public.households DROP CONSTRAINT households_account_id_fkey;
       public          postgres    false    218    4710    216         �           2606    144889 $   incidents incidents_reporter_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.employees(employee_id);
 N   ALTER TABLE ONLY public.incidents DROP CONSTRAINT incidents_reporter_id_fkey;
       public          postgres    false    217    4712    225         �           2606    144884 '   incidents incidents_responsible_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_responsible_id_fkey FOREIGN KEY (responsible_id) REFERENCES public.employees(employee_id);
 Q   ALTER TABLE ONLY public.incidents DROP CONSTRAINT incidents_responsible_id_fkey;
       public          postgres    false    225    4712    217         �           2606    144866 /   invoice_details invoice_details_invoice_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(invoice_id);
 Y   ALTER TABLE ONLY public.invoice_details DROP CONSTRAINT invoice_details_invoice_id_fkey;
       public          postgres    false    4718    224    220         �           2606    144871 /   invoice_details invoice_details_service_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(service_id);
 Y   ALTER TABLE ONLY public.invoice_details DROP CONSTRAINT invoice_details_service_id_fkey;
       public          postgres    false    224    219    4716         ~           2606    144797 #   invoices invoices_household_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id);
 M   ALTER TABLE ONLY public.invoices DROP CONSTRAINT invoices_household_id_fkey;
       public          postgres    false    220    218    4714         �           2606    144831 -   notifications notifications_household_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id);
 W   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_household_id_fkey;
       public          postgres    false    4714    222    218         �           2606    144826 +   notifications notifications_invoice_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(invoice_id);
 U   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_invoice_id_fkey;
       public          postgres    false    222    220    4718         �           2606    144836 +   notifications notifications_payment_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(payment_id);
 U   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_payment_id_fkey;
       public          postgres    false    221    4720    222                    2606    144814 #   payments payments_confirmed_by_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_confirmed_by_fkey FOREIGN KEY (confirmed_by) REFERENCES public.employees(employee_id);
 M   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_confirmed_by_fkey;
       public          postgres    false    221    4712    217         �           2606    144809 !   payments payments_invoice_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(invoice_id);
 K   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_invoice_id_fkey;
       public          postgres    false    221    220    4718         �           2606    144849 =   service_registrations service_registrations_household_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.service_registrations
    ADD CONSTRAINT service_registrations_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id);
 g   ALTER TABLE ONLY public.service_registrations DROP CONSTRAINT service_registrations_household_id_fkey;
       public          postgres    false    223    218    4714         �           2606    144854 ;   service_registrations service_registrations_service_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.service_registrations
    ADD CONSTRAINT service_registrations_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(service_id);
 e   ALTER TABLE ONLY public.service_registrations DROP CONSTRAINT service_registrations_service_id_fkey;
       public          postgres    false    219    223    4716         �           2606    144907    tasks tasks_assignee_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES public.employees(employee_id);
 F   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_assignee_id_fkey;
       public          postgres    false    217    226    4712         �           2606    144902    tasks tasks_assigner_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assigner_id_fkey FOREIGN KEY (assigner_id) REFERENCES public.employees(employee_id);
 F   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_assigner_id_fkey;
       public          postgres    false    4712    217    226                       4892.dat                                                                                            0000600 0004000 0002000 00000001076 15005116730 0014262 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        ACC001	manager_recep	password
ACC002	staff1_recep	password
ACC003	staff2_recep	password
ACC004	manager_clean	password
ACC005	staff1_clean	password
ACC006	staff2_clean	password
ACC007	manager_secur	password
ACC008	staff1_secur	password
ACC009	staff2_secur	password
ACC010	manager_acct	password
ACC011	staff1_acct	password
ACC012	staff2_acct	password
ACC013	manager_tech	password
ACC014	staff1_tech	password
ACC015	staff2_tech	password
ACC016	household1	password
ACC017	household2	password
ACC018	household3	password
ACC019	household4	password
ACC020	household5	password
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                  4891.dat                                                                                            0000600 0004000 0002000 00000000122 15005116730 0014250 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        RECEP	Reception
CLEAN	Cleaning
SECUR	Security
ACCT	Accounting
TECH	Technical
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                              4893.dat                                                                                            0000600 0004000 0002000 00000002401 15005116730 0014254 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        EMP001	Manager Reception	RECEP	ACC001	2025-05-02	manager	1234567890	123 Main St	active
EMP002	Staff 1 Reception	RECEP	ACC002	2025-05-02	staff	1234567891	124 Main St	active
EMP003	Staff 2 Reception	RECEP	ACC003	2025-05-02	staff	1234567892	125 Main St	active
EMP004	Manager Cleaning	CLEAN	ACC004	2025-05-02	manager	1234567893	126 Main St	active
EMP005	Staff 1 Cleaning	CLEAN	ACC005	2025-05-02	staff	1234567894	127 Main St	active
EMP006	Staff 2 Cleaning	CLEAN	ACC006	2025-05-02	staff	1234567895	128 Main St	active
EMP007	Manager Security	SECUR	ACC007	2025-05-02	manager	1234567896	129 Main St	active
EMP008	Staff 1 Security	SECUR	ACC008	2025-05-02	staff	1234567897	130 Main St	active
EMP009	Staff 2 Security	SECUR	ACC009	2025-05-02	staff	1234567898	131 Main St	active
EMP010	Manager Accounting	ACCT	ACC010	2025-05-02	manager	1234567899	132 Main St	active
EMP011	Staff 1 Accounting	ACCT	ACC011	2025-05-02	staff	1234567800	133 Main St	active
EMP012	Staff 2 Accounting	ACCT	ACC012	2025-05-02	staff	1234567801	134 Main St	active
EMP013	Manager Technical	TECH	ACC013	2025-05-02	manager	1234567802	135 Main St	active
EMP014	Staff 1 Technical	TECH	ACC014	2025-05-02	staff	1234567803	136 Main St	active
EMP015	Staff 2 Technical	TECH	ACC015	2025-05-02	staff	1234567804	137 Main St	active
\.


                                                                                                                                                                                                                                                               4894.dat                                                                                            0000600 0004000 0002000 00000000322 15005116730 0014255 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        H001	ACC016	4	Household 1	9876543210	101
H002	ACC017	3	Household 2	9876543211	102
H003	ACC018	2	Household 3	9876543212	103
H004	ACC019	5	Household 4	9876543213	104
H005	ACC020	1	Household 5	9876543214	105
\.


                                                                                                                                                                                                                                                                                                              4901.dat                                                                                            0000600 0004000 0002000 00000000304 15005116730 0014242 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        I001	Broken window	EMP013	2023-02-01 09:00:00	EMP001	Window in room 101 is broken	in_progress
I002	Leak in bathroom	EMP013	2023-02-02 10:00:00	EMP004	Leak in bathroom of room 102	in_progress
\.


                                                                                                                                                                                                                                                                                                                            4900.dat                                                                                            0000600 0004000 0002000 00000000242 15005116730 0014242 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        ID001	INV001	S001	1	50	50
ID002	INV001	S002	1	20	20
ID003	INV002	S001	2	50	100
ID004	INV003	S003	1	30	30
ID005	INV004	S002	3	20	60
ID006	INV005	S001	1	50	50
\.


                                                                                                                                                                                                                                                                                                                                                              4896.dat                                                                                            0000600 0004000 0002000 00000000504 15005116730 0014261 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        INV001	H001	70	2023-01-01	2023-01-01 10:00:00	2023-01-31	overdue
INV002	H002	50	2023-01-01	2023-01-01 10:00:00	2023-01-31	paid
INV003	H003	30	2023-01-01	2023-01-01 10:00:00	2023-01-31	overdue
INV004	H004	20	2023-01-01	2023-01-01 10:00:00	2023-01-31	paid
INV005	H005	50	2023-01-01	2023-01-01 10:00:00	2023-01-31	overdue
\.


                                                                                                                                                                                            4898.dat                                                                                            0000600 0004000 0002000 00000000171 15005116730 0014263 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        N001	INV002	H002	P001	Payment received for invoice INV002
N002	INV004	H004	P002	Payment received for invoice INV004
\.


                                                                                                                                                                                                                                                                                                                                                                                                       4897.dat                                                                                            0000600 0004000 0002000 00000000154 15005116730 0014263 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        P001	INV002	50	2023-01-15 10:00:00	cash	EMP010
P002	INV004	20	2023-01-20 10:00:00	bank_transfer	EMP010
\.


                                                                                                                                                                                                                                                                                                                                                                                                                    4899.dat                                                                                            0000600 0004000 0002000 00000000321 15005116730 0014261 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        SR001	H001	S001	2023-01-01	in_use
SR002	H001	S002	2023-01-01	in_use
SR003	H002	S001	2023-01-01	in_use
SR004	H003	S003	2023-01-01	in_use
SR005	H004	S002	2023-01-01	in_use
SR006	H005	S001	2023-01-01	in_use
\.


                                                                                                                                                                                                                                                                                                               4895.dat                                                                                            0000600 0004000 0002000 00000000115 15005116730 0014256 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        S001	Internet	50	active
S002	Water	20	active
S003	Electricity	30	active
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                   4902.dat                                                                                            0000600 0004000 0002000 00000000324 15005116730 0014245 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        T001	Fix broken window	EMP013	EMP014	2023-02-01	Fix the window in room 101	2023-02-05	pending
T002	Repair leak in bathroom	EMP013	EMP015	2023-02-02	Repair the leak in bathroom of room 102	2023-02-06	pending
\.


                                                                                                                                                                                                                                                                                                            restore.sql                                                                                         0000600 0004000 0002000 00000044277 15005116730 0015400 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
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

DROP DATABASE pttk;
--
-- Name: pttk; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE pttk WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'vi-VN';


ALTER DATABASE pttk OWNER TO postgres;

\connect pttk

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
    'staff'
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
    'bank_transfer'
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
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    account_id character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.accounts OWNER TO postgres;

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
    department_id character varying NOT NULL,
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
    room_number character varying NOT NULL
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
    service_registration_id character varying NOT NULL,
    household_id character varying NOT NULL,
    service_id character varying NOT NULL,
    start_date date NOT NULL,
    status public.service_registration_status DEFAULT 'in_use'::public.service_registration_status
);


ALTER TABLE public.service_registrations OWNER TO postgres;

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
    assigned_time date,
    description character varying,
    deadline date,
    status public.task_status DEFAULT 'pending'::public.task_status
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (account_id, username, password) FROM stdin;
\.
COPY public.accounts (account_id, username, password) FROM '$$PATH$$/4892.dat';

--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (department_id, department_name) FROM stdin;
\.
COPY public.departments (department_id, department_name) FROM '$$PATH$$/4891.dat';

--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (employee_id, employee_name, department_id, account_id, begin_date, "position", phone, address, status) FROM stdin;
\.
COPY public.employees (employee_id, employee_name, department_id, account_id, begin_date, "position", phone, address, status) FROM '$$PATH$$/4893.dat';

--
-- Data for Name: households; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.households (household_id, account_id, number_of_members, name, phone, room_number) FROM stdin;
\.
COPY public.households (household_id, account_id, number_of_members, name, phone, room_number) FROM '$$PATH$$/4894.dat';

--
-- Data for Name: incidents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.incidents (incident_id, incident_name, responsible_id, report_time, reporter_id, description, status) FROM stdin;
\.
COPY public.incidents (incident_id, incident_name, responsible_id, report_time, reporter_id, description, status) FROM '$$PATH$$/4901.dat';

--
-- Data for Name: invoice_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_details (invoice_detail_id, invoice_id, service_id, quantity, price, total) FROM stdin;
\.
COPY public.invoice_details (invoice_detail_id, invoice_id, service_id, quantity, price, total) FROM '$$PATH$$/4900.dat';

--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (invoice_id, household_id, amount, month_date, created_date, due_date, status) FROM stdin;
\.
COPY public.invoices (invoice_id, household_id, amount, month_date, created_date, due_date, status) FROM '$$PATH$$/4896.dat';

--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (notification_id, invoice_id, household_id, payment_id, message) FROM stdin;
\.
COPY public.notifications (notification_id, invoice_id, household_id, payment_id, message) FROM '$$PATH$$/4898.dat';

--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, invoice_id, amount, date, method, confirmed_by) FROM stdin;
\.
COPY public.payments (payment_id, invoice_id, amount, date, method, confirmed_by) FROM '$$PATH$$/4897.dat';

--
-- Data for Name: service_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_registrations (service_registration_id, household_id, service_id, start_date, status) FROM stdin;
\.
COPY public.service_registrations (service_registration_id, household_id, service_id, start_date, status) FROM '$$PATH$$/4899.dat';

--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (service_id, service_name, price, status) FROM stdin;
\.
COPY public.services (service_id, service_name, price, status) FROM '$$PATH$$/4895.dat';

--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (task_id, name_task, assigner_id, assignee_id, assigned_time, description, deadline, status) FROM stdin;
\.
COPY public.tasks (task_id, name_task, assigner_id, assignee_id, assigned_time, description, deadline, status) FROM '$$PATH$$/4902.dat';

--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (account_id);


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
    ADD CONSTRAINT employees_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(account_id);


--
-- Name: employees employees_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id);


--
-- Name: households households_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(account_id);


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
-- Name: notifications notifications_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(payment_id);


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

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 