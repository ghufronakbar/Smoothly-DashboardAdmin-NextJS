import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  CloseButton,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axiosInstanceAuthorization from "../../lib/axiosInstanceAuthorization";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Loading } from "../Loading";
import { primaryColor, secondaryColor, tersierColor, white } from "@/lib/color";
import { ExternalLinkIcon, InfoIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { useSearchParams } from "next/navigation";
import formatDate from "@/lib/formatDate";
import { useState } from "react";
import formatTime from "@/lib/formatTime";

export function TablePesanan() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const queryStatus = searchParams.get("status_pesanan");
  const [indexDetail, setIndexDetail] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [buktiPembayaran, setBuktiPembayaran] = useState();

  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({
    defaultIsOpen: true,
  });

  const {
    data: dataRiwayat,
    isLoading,
    isError,
    refetch: refetchDataRiwayat,
  } = useQuery({
    queryKey: ["riwayat", queryStatus],
    queryFn: async () => {
      let paramsStatus
      if(queryStatus){paramsStatus = `?status_pesanan=${queryStatus}`}
      else if(queryStatus == undefined){paramsStatus = ``}
      const dataResponse = await axiosInstanceAuthorization.get(`/riwayat/${paramsStatus}`);      
      return dataResponse.data;
    },
  });

  const NoData = () => {
    if (dataRiwayat && dataRiwayat.length === 0) {
      return (
        <Alert status="warning">
          <AlertIcon />
          There's no data event
        </Alert>
      );
    }
  };

  const handleReject = async (id_pemesanan) => {
    try {
      const response = await axiosInstanceAuthorization.put(
        `/transaksi/reject/${id_pemesanan}`
      );
      toast({
        title: response.data.message,
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });
      refetchDataRiwayat();
      setIsDetailOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };
  const handleProcess = async (id_pemesanan) => {
    try {
      const response = await axiosInstanceAuthorization.put(
        `/transaksi/process/${id_pemesanan}`
      );
      toast({
        title: response.data.message,
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });
      refetchDataRiwayat();
      setIsDetailOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };
  const handleFinish = async (id_pemesanan) => {
    try {
      const response = await axiosInstanceAuthorization.put(
        `/transaksi/finish/${id_pemesanan}`
      );
      toast({
        title: response.data.message,
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });
      refetchDataRiwayat();
      setIsDetailOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const ModalBuktiPembayaran = () => {
    return (
      <Modal
        size="xl"
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bukti Pembayaran</ModalHeader>
          <ModalBody>
            <Image
              src={buktiPembayaran}
              alt={buktiPembayaran}
              width={600}
              height={400}
              objectFit="contain"
            />
            <Table>
              <Tr>
                <Th>Tanggal Pembayaran</Th>
                <Td>
                  {indexDetail?.pembayaran?.tanggal_pembayaran
                    ? formatDate(indexDetail?.pembayaran?.tanggal_pembayaran)
                    : null}{" "}
                  {indexDetail?.pembayaran?.tanggal_pembayaran
                    ? formatTime(indexDetail?.pembayaran?.tanggal_pembayaran)
                    : null}
                </Td>
              </Tr>
              <Tr>
                <Th>Metode Pembayaran</Th>
                <Td>{indexDetail?.pembayaran?.metode_pembayaran}</Td>
              </Tr>
            </Table>
          </ModalBody>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              bg={primaryColor}
              color={white}
              onClick={() => {
                setIsImageOpen(false);
              }}
            >
              Keluar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const AlertMessage = () => {
    return isVisible ? (
      <Alert my={4} status="info">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Pesan!</AlertTitle>
          <AlertDescription>
            Anda dapat melakukan pembatalan atau pemrosesan untuk pesanan yang
            telah dibayar. Jangan lupa untuk mengonfirmasi pesanan yang telah
            selesai.
          </AlertDescription>
        </Box>
        <CloseButton
          alignSelf="flex-start"
          position="absolute"
          right={2}
          top={2}
          onClick={onClose}
        />
      </Alert>
    ) : null;
  };

  const ModalDetail = () => {
    return (
      <>
        <Modal
          isOpen={isDetailOpen}
          size='xl'
          onClose={() => {
            setIsDetailOpen(false);
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Detail Pesanan</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TableContainer>
                <Table>
                  <Tr>
                    <Th>Jumlah Sepatu</Th>
                    <Td>{indexDetail?.jumlah_sepatu}</Td>
                  </Tr>
                  <Tr>
                    <Th>Status Pemesanan</Th>
                    <Td>{indexDetail?.layanan?.nama_layanan}</Td>
                  </Tr>
                  <Tr>
                    <Th>Catatan Pelaggan</Th>
                    <Td>{indexDetail?.catatan_pelanggan}</Td>
                  </Tr>
                  <Tr>
                    <Th>Status Pemesanan</Th>
                    <Td>{indexDetail?.status_pemesanan}</Td>
                  </Tr>
                  <Tr>
                    <Th>Total Biaya</Th>
                    <Td>Rp {indexDetail?.total_biaya}</Td>
                  </Tr>
                  <Tr>
                    <Th>Pembayaran</Th>
                    <Td>
                      {indexDetail?.pembayaran?.metode_pembayaran ? (
                        <>
                          <HStack>
                            <Text>
                            {indexDetail?.pembayaran?.metode_pembayaran}{" "}
                            </Text>
                            <InfoIcon
                              onClick={() => {
                                setIsImageOpen(true);
                                setBuktiPembayaran(
                                  indexDetail?.pembayaran?.bukti_pembayaran
                                );
                              }}
                            />
                          </HStack>
                        </>
                      ) : (
                        "Belum Dibayar"
                      )}{" "}
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Tanggal Masuk</Th>
                    <Td>
                      {indexDetail?.transaksi?.tanggal_masuk
                        ? formatDate(indexDetail.transaksi.tanggal_masuk)
                        : "-"}
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Tanggal Keluar</Th>
                    <Td>
                      {indexDetail?.transaksi?.tanggal_keluar
                        ? formatDate(indexDetail.transaksi.tanggal_keluar)
                        : "-"}
                    </Td>
                  </Tr>
                </Table>
              </TableContainer>
            </ModalBody>
            <ModalFooter>
              {indexDetail?.kode_status_pemesanan === 1 ? (
                <>
                  <HStack>
                    <Button
                      color={white}
                      bg={secondaryColor}
                      onClick={() => {
                        handleReject(indexDetail?.id_pemesanan);
                      }}
                    >
                      Batalkan
                    </Button>
                    <Button
                      color={white}
                      bg={primaryColor}
                      onClick={() => {
                        handleProcess(indexDetail?.id_pemesanan);
                      }}
                    >
                      Proses
                    </Button>
                  </HStack>
                </>
              ) : indexDetail?.kode_status_pemesanan === 3 ? (
                <Button
                  color={white}
                  bg={primaryColor}
                  onClick={() => {
                    handleFinish(indexDetail?.id_pemesanan);
                  }}
                >
                  Selesai
                </Button>
              ) : null}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };

  if (isLoading) return <Loading />;
  if (isError) return <Text>Error loading data</Text>;

  return (
    <>
      <TableContainer>
        {AlertMessage()}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th></Th>
              <Th>Pelanggan</Th>
              <Th>Lokasi</Th>
              <Th>Waktu Pemesanan</Th>
              <Th>
                <Center>Status</Center>
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataRiwayat &&
              dataRiwayat.data.map((riwayat, index) => (
                <Tr key={riwayat.id_pemesanan}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Image
                      src={riwayat.pelanggan.foto_profil}
                      alt={riwayat.pelanggan.nama}
                      boxSize="50px"
                      borderRadius="30%"
                      objectFit="cover"
                    />
                  </Td>
                  <Td>
                    <Text as="b">{riwayat.pelanggan.nama}</Text>
                    <Text>{riwayat.pelanggan.email}</Text>
                    <Text>{riwayat.pelanggan.no_telepon}</Text>
                  </Td>
                  <Td>
                    <HStack>
                      <VStack align="start">
                        <Text>{riwayat.lokasi.latitude}</Text>
                        <Text>{riwayat.lokasi.longitude}</Text>
                      </VStack>
                      <a href={riwayat.lokasi.url_google_map} target="_blank">
                        <ExternalLinkIcon />
                      </a>
                    </HStack>
                  </Td>
                  <Td>
                    <Text>{formatDate(riwayat.tanggal_pemesanan)}</Text>
                    <Text>{formatTime(riwayat.tanggal_pemesanan)}</Text>
                  </Td>
                  <Td>
                    <Center>
                      <Box
                        as="button"
                        borderRadius="md"
                        borderWidth="1px"
                        px={4}
                        h={8}
                        variant="outline"
                      >
                        <Text>{riwayat.status_pemesanan}</Text>
                      </Box>
                    </Center>
                  </Td>
                  <Td>
                    <InfoOutlineIcon
                      onClick={() => {
                        setIndexDetail(dataRiwayat.data[index]);
                        setIsDetailOpen(true);
                      }}
                    />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        {NoData()}
      </TableContainer>
      {ModalDetail()}
      {ModalBuktiPembayaran()}
    </>
  );
}
