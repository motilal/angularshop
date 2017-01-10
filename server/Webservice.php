<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Webservice extends CI_Controller {

    public function __construct() {
        //error_reporting(0);
        header('Access-Control-Allow-Origin: *');
        parent::__construct();
    }

    public function get_product_list() {
        $query = $this->db->order_by('id', 'DESC')->get('product');
        if ($query->num_rows() > 0) {
            $products = $query->result_array();
            foreach ($products as $key => $product) {
                if ($product['image'] != "" && file_exists('media/products/' . $this->getThumbName($product['image']))) {
                    $products[$key]['image'] = base_url('media/products/' . $this->getThumbName($product['image']));
                }
                if ($product['description'] != "" && strlen($product['description']) > 150) {
                    $products[$key]['description'] = substr($product['description'], 0, 150) . '...';
                }
            }
            $responseData = array(
                'status' => 'success',
                'result' => $products
            );
        } else {
            $responseData = array(
                'status' => 'error',
                'result' => 'no result found.'
            );
        }
        die(json_encode($responseData));
    }

    private function getThumbName($filename) {
        $imgAray = explode('.', $filename);
        $thumbname = $imgAray[0] . '_thumb.' . $imgAray[1];
        return $thumbname;
    }

    public function add_product() {
        $decoded = (object) $this->input->post(); 
        $response = array();
        if (!empty($decoded)) {
            $data = array('name' => $decoded->name,
                'description' => $decoded->description,
                'price' => $decoded->price,
                'sku' => $decoded->sku
            );
            if (isset($_FILES['image']['name']) && $_FILES['image']['name'] != "") {
                $directory = "./media/products/";
                if (!is_dir($directory)) {
                    mkdir($directory, 777);
                }
                $config['upload_path'] = $directory;
                $config['allowed_types'] = "jpg|jpeg|tiff|tif|png|gif|bmp";
                $config['max_size'] = 5 * 1024 * 1024;
                $config['file_name'] = date(time());
                $this->load->library('upload');
                $this->upload->initialize($config);
                $img_error = false;
                if (!$this->upload->do_upload('image')) {
                    $img_error = true;
                    $response = array('error' => $this->upload->display_errors(), 'status' => 'error');
                } else {
                    $upload_data = $this->upload->data();
                    $data['image'] = $upload_data['file_name'];
                    $fullImagePath = './media/products/' . $upload_data['file_name'];
                    $config_resize['image_library'] = 'gd2';
                    $config_resize['source_image'] = $fullImagePath;
                    $config_resize['create_thumb'] = TRUE;
                    $config_resize['maintain_ratio'] = TRUE;
                    $config_resize['width'] = 50;
                    $config_resize['height'] = 50;
                    $this->load->library('image_lib');
                    $this->image_lib->initialize($config_resize);
                    if (!$this->image_lib->resize()) {
                        $this->image_lib->clear();
                        $img_error = true;
                        $response = array('error' => $this->image_lib->display_errors(), 'status' => 'error');
                    }
                }
            }
            if (isset($decoded->id) && $decoded->id > 0) {
                $this->db->where('id', $decoded->id)->update('product', $data);
                $response['status'] = 'success';
                $response['msg'] = 'Your product has been successfully updated.';
            } else {
                if (!$img_error && $this->db->insert('product', $data)) {
                    $response['status'] = 'success';
                    $response['msg'] = 'Your product has been successfully saved.';
                }
            }
            echo json_encode($response);
        }
    }

    public function check_sku_duplicate() {
        $decoded = json_decode(file_get_contents("php://input"));
        $response = array();
        if (!empty($decoded)) {
            $data = array(
                'sku' => $decoded->sku
            );
            if ($decoded->id > 0) {
                $data['id != '] = $decoded->id;
            }
            $query = $this->db->select('*', FALSE)->get_where('product', $data);
            if ($query->num_rows() > 0) {
                $response['status'] = 'error';
                $response['msg'] = 'This sku code already exist on database.';
            } else {
                $response['status'] = 'success';
            }
            echo json_encode($response);
        }
    }

    public function delete_product() {
        $decoded = json_decode(file_get_contents("php://input"));
        $response = array();
        if (!empty($decoded)) {
            $data = array(
                'id' => $decoded->id
            );
            $query = $this->db->where($data)->delete('product');
            if ($query) {
                $response['status'] = 'success';
                $response['msg'] = 'The product deleted successfully.';
            } else {
                $response['status'] = 'error';
            }
            echo json_encode($response);
        }
    }

    public function get_product_detail($id = "") {
        if ($id > 0) {
            $query = $this->db->where('id', $id)->get('product');
            if ($query->num_rows() > 0) {
                $product = $query->row_array();
                if ($product['image'] != "" && file_exists('media/products/' . $product['image'])) {
                    $product['image'] = base_url('media/products/' . $product['image']);
                }
                $responseData = array(
                    'status' => 'success',
                    'result' => $product
                );
            } else {
                $responseData = array(
                    'status' => 'error',
                    'result' => 'no result found.'
                );
            }
            die(json_encode($responseData));
        }
    }

    public function add_user() {
        $decoded = $_POST = (array) json_decode(file_get_contents("php://input"));
        $response = array();
        $this->form_validation->set_rules('first_name', 'First Name', 'required|max_length[20]');
        $this->form_validation->set_rules('last_name', 'Last Name', 'required|max_length[20]');
        $this->form_validation->set_rules('email', 'Email', 'required|max_length[50]|valid_emails|is_unique[users.email]');
        $this->form_validation->set_rules('username', 'Username', 'required|max_length[50]|is_unique[users.username]');
        $this->form_validation->set_rules('password', 'Password', 'required|max_length[30]');
        $this->form_validation->set_rules('confpassword', 'Confirm Password', 'required|max_length[30]|matches[password]');
        $this->form_validation->set_error_delimiters('<span class="text-danger">', '</span>');
        if ($this->form_validation->run() == true) {

            $data = array('first_name' => $decoded['first_name'],
                'last_name' => $decoded['last_name'],
                'email' => $decoded['email'],
                'username' => $decoded['username'],
                'password' => $decoded['password']
            );
            if ($this->db->insert('users', $data)) {
                $response['status'] = 'success';
                $response['msg'] = 'Your registration has been successfully saved.';
            }
        } else {
            $response['status'] = 'error';
            $response['error'] = $this->form_validation->error_array();
        }
        echo json_encode($response);
        exit;
    }

    public function login() {
        $decoded = json_decode(file_get_contents("php://input"));
        if (!empty($decoded)) {
            $data = array(
                'username' => $decoded->username,
                'password' => trim($decoded->password)
            );
            $query = $this->db->where($data)->get('users');
            if ($query->num_rows() > 0) {
                $response['status'] = 'success';
                $response['msg'] = 'Login successfully.';
            } else {
                $response['status'] = 'error';
                $response['msg'] = 'Username or password is incorrect.';
            }
            echo json_encode($response);
        }
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */