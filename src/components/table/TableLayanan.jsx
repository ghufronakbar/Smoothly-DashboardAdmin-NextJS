import {
  Alert,
  AlertIcon,
  Button,
  Center,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  ModalBody,
  FormControl,
  Input,
  FormLabel,
  VStack,
  Textarea,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInput, 
} from "@chakra-ui/react";
import axiosInstanceAuthorization from "../../lib/axiosInstanceAuthorization";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../Loading";
import { primaryColor, secondaryColor, white } from "@/lib/color";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function TableLayanan() {
  const toast = useToast();
  const searchParams = useSearchParams();  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isModalLayanan, setIsModalLayanan] = useState(false);
  const [namaLayanan, setNamaLayanan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [harga, setHarga] = useState(0);
  const [idLayanan, setIdLayanan] = useState(0);

  const {
    data: dataLayanan,
    isLoading,
    isError,
    refetch: refetchDataLayanan,
  } = useQuery({
    queryKey: ["layanan"],
    queryFn: async () => {
      const dataResponse = await axiosInstanceAuthorization.get(`/layanan`);
      return dataResponse.data.rows;
    },
  });

  const NoData = () => {
    if (dataLayanan && dataLayanan.length === 0) {
      return (
        <Alert status="warning">
          <AlertIcon />
          There's no data event
        </Alert>
      );
    }
  };

  const handleDelete = async (id_layanan) => {
    try {
      const response = await axiosInstanceAuthorization.delete(
        `/layanan/${id_layanan}`
      );
      toast({
        title: response.data.message,
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });
      refetchDataLayanan();
      setIdLayanan(0);
      setIsDeleteOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        title: error.response?.data?.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axiosInstanceAuthorization.post(`/layanan`, {
        nama_layanan: namaLayanan,
        deskripsi,
        harga,
      });
      toast({
        title: response.data.message,
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });
      refetchDataLayanan();
      setNamaLayanan("");
      setDeskripsi("");
      setHarga(0);
      setIsModalLayanan(false);
    } catch (error) {
      console.log(error);
      toast({
        title: error.response?.data?.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const handleEdit = async (id_layanan) => {
    try {
      const response = await axiosInstanceAuthorization.put(
        `/layanan/${id_layanan}`,
        {
          nama_layanan: namaLayanan,
          deskripsi,
          harga,
        }
      );
      toast({
        title: response.data.message,
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });
      refetchDataLayanan();
      setIdLayanan(0);
      setNamaLayanan("");
      setDeskripsi("");
      setHarga(0);
      setIsModalLayanan(false);
    } catch (error) {
      console.log(error);
      toast({
        title: error.response?.data?.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const ModalDelete = () => {
    return (
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setIdLayanan(0);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Kamu yakin ingin menghapus layanan ini?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              color={white}
              bg={secondaryColor}
              onClick={() => {
                handleDelete(idLayanan);
              }}
            >
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const ModalLayanan = () => {
    return (
      <Modal
        isOpen={isModalLayanan}
        onClose={() => {
          setIsModalLayanan(false);
          setIdLayanan(0);
          setNamaLayanan("");
          setHarga(0);
          setDeskripsi("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {idLayanan == 0 ? "Tambah" : "Edit"} Layanan
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={4}>
              <FormControl isRequired>
                <FormLabel>Nama Layanan</FormLabel>
                <Input
                  value={namaLayanan}
                  onChange={(e) => setNamaLayanan(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Deskripsi</FormLabel>
                <Textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Harga</FormLabel>
                <NumberInput value={harga} min={0}>
                  <NumberInputField
                    onChange={(e) => setHarga(e.target.value)}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper
                      onClick={() => setHarga(harga + 10000)}
                    />
                    <NumberDecrementStepper
                      onClick={() => setHarga(harga - 10000)}
                    />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              color={white}
              bg={primaryColor}
              onClick={() => {
                idLayanan == 0 ? handleAdd() : handleEdit(idLayanan);
              }}
            >
              {idLayanan == 0 ? "Tambah" : "Edit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  if (isLoading) return <Loading />;
  if (isError) return <Text>Error loading data</Text>;

  return (
    <>
      <TableContainer>
        <Button
          bg={primaryColor}
          color="white"
          mb={2}
          onClick={() => {
            setIsModalLayanan(true);
          }}
        >
          Tambah Layanan
        </Button>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Layanan</Th>
              <Th>Deskripsi</Th>
              <Th>Harga</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataLayanan &&
              dataLayanan.map((layanan, index) => (
                <Tr key={layanan.id_layanan}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Text as="b">{layanan.nama_layanan}</Text>
                  </Td>
                  <Td>
                    <Text noOfLines={2}>{layanan.deskripsi}</Text>
                  </Td>
                  <Td>
                    <Text>Rp {layanan.harga}</Text>
                  </Td>
                  <Td>
                    <Center gap={4}>
                      <Button
                        bg={primaryColor}
                        color={white}
                        onClick={() => {
                          setIdLayanan(layanan.id_layanan);
                          setIsModalLayanan(true);
                          setNamaLayanan(layanan.nama_layanan);
                          setDeskripsi(layanan.deskripsi);
                          setHarga(layanan.harga);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        bg={secondaryColor}
                        color={white}
                        onClick={() => {
                          setIdLayanan(layanan.id_layanan);
                          setIsDeleteOpen(true);
                        }}
                      >
                        Hapus
                      </Button>
                    </Center>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        <NoData />
      </TableContainer>
      {ModalLayanan()}
      {ModalDelete()}
    </>
  );
}
