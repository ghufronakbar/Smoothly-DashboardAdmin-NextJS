import {
  Box,
  Center,
  Flex,
  Image,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Stack,
  Text,
  Table,
  Tr,
  Th,
  TableContainer,
  TableCaption,
  Td,
  position,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  ModalCloseButton,
  ModalFooter,ModalHeader
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceAuthorization from "@/lib/axiosInstanceAuthorization";
import { LoadingComponent } from "../LoadingComponent";
import { Loading } from "../Loading";
import { primaryColor, white } from "@/lib/color";


export function DetailProfile() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [nama, setNama] = useState("");
  const [logo, setLogo] = useState(null);
  const [username, setUsername] = useState("");
  const [tokoLatitude, setLatitude] = useState("");
  const [tokoLongitude, setLongitude] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false);
  const [nowLatitude, setNowLatitude] = useState("");
  const [nowLongitude, setNowLongitude] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setNowLatitude(position.coords.latitude);
      setNowLongitude(position.coords.longitude);
    });
  });

  const { data: dataProfile, refetch: refetchDataProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstanceAuthorization.get(`/profile`);
      const profileData = data.rows[0];
      setProfile(profileData);
      setNama(profileData.nama);
      setUsername(profileData.username);
      setLatitude(profileData.toko_latitude);
      setLongitude(profileData.toko_longitude);
      setLoading(false);
      return data;
    },
  });

  const handleUpdate = async () => {
    try {
      const response = await axiosInstanceAuthorization.put(`/profile`, {
        nama,
        username,
      });

      toast({
        title: response.data.message,
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });
      refetchDataProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: error.response.data.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const ModalSetLocation = () => {
    return (
      <Modal
        size="xl"
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ganti Lokasi Toko</ModalHeader>
          <ModalBody>
            Apakah anda yakin ingin mengganti lokasi toko dengan lokasi terkini?
            <Alert my={4} status="info">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Pesan!</AlertTitle>
                <AlertDescription>
                  Aksi tidak dapat dikembalikan
                </AlertDescription>
              </Box>             
            </Alert>
          </ModalBody>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              bg={primaryColor}
              color={white}
              onClick={() => {
                handleLocation()
              }}
            >
              Konfirmasi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const handleLocation = async () => {
    console.log({nowLatitude,nowLongitude})
    try {
      const response = await axiosInstanceAuthorization.put(`/location`, {
        toko_latitude: nowLatitude,
        toko_longitude: nowLongitude,
      });

      toast({
        title: response.data.message,
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });
      refetchDataProfile();
      setIsLocationOpen(false)
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

  const handlePassword = async () => {
    try {
      const response = await axiosInstanceAuthorization.put(
        `/profile/password`,
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirmation_password: confirmationPassword,
        }
      );
      toast({
        title: response.data.message,
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmationPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: error.response.data.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Error fetching data</div>;

  return (
    <>
      {profile && (
        <Stack>
          <Box
            p={8}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            m={4}
            flex={2}
          >
            <FormLabel>Lokasi Toko Saat Ini</FormLabel>
            <Table>
              <TableContainer>
                <Tr>
                  <Th>Latitude</Th>
                  <Td>{tokoLatitude}</Td>
                </Tr>
                <Tr>
                  <Th>Longitude</Th>
                  <Td>{tokoLongitude}</Td>
                </Tr>
              </TableContainer>
            </Table>
            <Center>
              <Button
                color={white}
                bg={primaryColor}
                mt={4}
                onClick={() => {
                  setIsLocationOpen(true);
                }}
              >
                Ganti Dengan Lokasi Terkini
              </Button>
            </Center>
          </Box>
          <Flex justifyContent="center">
            <Box
              p={8}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              m={4}
              flex={2}
            >
              <form>
                <FormControl my={6}>
                  <FormLabel>Nama</FormLabel>
                  <Input
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </FormControl>
                <FormControl my={6}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>
                <VStack>
                  <Button
                    bg={primaryColor}
                    color={white}
                    onClick={() => {
                      handleUpdate();
                    }}
                  >
                    Edit Profile
                  </Button>
                </VStack>
              </form>
            </Box>
            <Box
              p={8}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              m={4}
              flex={1}
            >
              <form>
                <FormControl my={6}>
                  <FormLabel>Old Password</FormLabel>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </FormControl>
                <FormControl my={6}>
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </FormControl>
                <FormControl my={6}>
                  <FormLabel>Confirmation Password</FormLabel>
                  <Input
                    type="password"
                    value={confirmationPassword}
                    onChange={(e) => setConfirmationPassword(e.target.value)}
                  />
                </FormControl>
                <VStack>
                  <Button
                    color={white}
                    bg={primaryColor}
                    onClick={() => {
                      handlePassword();
                    }}
                  >
                    Edit Password
                  </Button>
                </VStack>
              </form>
              
              <ModalSetLocation/>
            </Box>
          </Flex>
        </Stack>
      )}
    </>
  );
}
