import {
  Alert,
  AlertIcon,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import axiosInstanceAuthorization from "../../lib/axiosInstanceAuthorization";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../Loading";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { useSearchParams } from "next/navigation";
import formatDate from "@/lib/formatDate";
import { useState } from "react";
import formatTime from "@/lib/formatTime";
import formatString from "@/lib/formatString";

export function TablePelanggan() {
  const searchParams = useSearchParams();
  const queryStatus = searchParams.get("status_pesanan");
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: dataProfile,
    isError,
    refetch: refetchDataRiwayat,
  } = useQuery({
    queryKey: ["pelanggan", queryStatus],
    queryFn: async () => {
      const dataResponse = await axiosInstanceAuthorization.get(`/pelanggan`);
      setIsLoading(false);
      return dataResponse.data;
    },
  });

  const NoData = () => {
    if (dataProfile && dataProfile.data.length === 0) {
      return (
        <Alert status="warning">
          <AlertIcon />
          Tidak ada data pesanan
        </Alert>
      );
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <Text>Error loading data</Text>;

  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th></Th>
              <Th>Nama</Th>
              <Th>Email / No Telepon</Th>
              <Th>Alamat</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataProfile &&
              dataProfile.data.map((profile, index) => (
                <Tr key={profile.id_pemesanan}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Tooltip
                      hasArrow
                      label={
                        "Registrasi saat : " +
                        formatDate(profile.waktu_registrasi) +
                        " " +
                        formatTime(profile.waktu_registrasi)
                      }
                      bg="gray.300"
                      color="black"
                    >
                      <Image
                        src={profile.foto_profil}
                        alt={profile.nama}
                        boxSize="50px"
                        borderRadius="30%"
                        objectFit="cover"
                      />
                    </Tooltip>
                  </Td>
                  <Td>
                    <Text as="b">{profile.nama}</Text>
                  </Td>
                  <Td>
                    <Text>{profile.email}</Text>
                    <Text>{profile.no_telepon}</Text>
                  </Td>
                  <Td>
                    <Tooltip
                      hasArrow
                      label={profile.alamat}
                      bg="gray.300"
                      color="black"
                    >
                      {formatString(profile.alamat)}
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip
                      hasArrow
                      label={
                        profile.pemesanan.total_pemesanan > 0
                          ? "Total Pemesanan : " +
                            profile.pemesanan.total_pemesanan +
                            " || " +
                            "Total Sepatu : " +
                            profile.pemesanan.total_sepatu +
                            " || " +
                            "Total Pengeluaran : Rp " +
                            profile.pemesanan.total_biaya
                          : "Belum melakukan pemesanan"
                      }
                      bg="gray.300"
                      color="black"
                    >
                      <InfoOutlineIcon />
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        {NoData()}
      </TableContainer>
    </>
  );
}
