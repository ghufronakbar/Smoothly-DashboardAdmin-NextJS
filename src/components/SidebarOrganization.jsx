import { Box, Center, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceAuthorization from "@/lib/axiosInstanceAuthorization";
import { primaryColor, secondaryColor, tersierColor } from "@/lib/color";
import Image from "next/image";
import { CheckCircleIcon, CheckIcon, CloseIcon, NotAllowedIcon, SpinnerIcon, TimeIcon, WarningTwoIcon } from "@chakra-ui/icons";

export function SidebarMenu() {
  const router = useRouter();

  const { data: profileSB, isLoading: loadingProfileSB } = useQuery({
    queryKey: ["profileSB"],
    queryFn: async () => {
      const { data } = await axiosInstanceAuthorization.get("/profile");
      return data.rows[0];
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  return (
    <>
      {!loadingProfileSB && profileSB && (
        <Sidebar>
          <br />
          <Box
            p={3}
            mx={2}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Stack onClick={() => router.push(`/admin/profile`)}>             
              <Text as="b" fontSize="2xl" color={secondaryColor} textAlign="center">
                {profileSB.nama}
              </Text>
            </Stack>
          </Box>
          <br />
          <br />
          <Menu>
              <MenuItem onClick={() => router.push(`/admin/layanan`)}>📑 Layanan</MenuItem>             
            <SubMenu label="📒 Pesanan">
              <MenuItem onClick={() => router.push(`/admin/pesanan`)}>🎫 Semua Pesanan</MenuItem>
              <MenuItem onClick={() => router.push(`/admin/pesanan?status_pesanan=0`)}><HStack><TimeIcon color={tersierColor} /><Text>Menunggu Pembayaran</Text> </HStack></MenuItem>
              <MenuItem onClick={() => router.push(`/admin/pesanan?status_pesanan=1`)}><HStack><CheckIcon color={primaryColor} /><Text>Telah Dibayar</Text> </HStack></MenuItem>
              <MenuItem onClick={() => router.push(`/admin/pesanan?status_pesanan=2`)}><HStack><WarningTwoIcon color={secondaryColor} /><Text>Dibatalkan</Text> </HStack></MenuItem>
              <MenuItem onClick={() => router.push(`/admin/pesanan?status_pesanan=3`)}><HStack><SpinnerIcon color='black'/><Text>Dalam Proses</Text> </HStack></MenuItem>
              <MenuItem onClick={() => router.push(`/admin/pesanan?status_pesanan=4`)}><HStack> <CheckCircleIcon color={primaryColor} /><Text>Selesai</Text> </HStack></MenuItem>
            </SubMenu>
            <MenuItem onClick={handleLogout}>🔒 Logout</MenuItem>
          </Menu>
        </Sidebar>
      )}
    </>
  );
}
